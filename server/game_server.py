from gevent import monkey
monkey.patch_all()

import grpc.experimental.gevent as grpc_gevent
grpc_gevent.init_gevent()

from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app, resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')
cred = credentials.Certificate('firebase-service-key.json')
firebase_admin.initialize_app(cred)
print("firebase initialized:", firebase_admin.get_app())
db = firestore.client()

# Storage and game state
# These are only local storage, will be added to database only when game ends
users = {
    # "user_id": {
    #     "sid": "session_id",
    #     "currentGame": "game_id",
    #     "invited": ["game_id"],
    # }
}
active_games = {
    # "game_id": {
    #     "creator": "user_id",
    #     "players": ["user_id"],
    #     "invited": ["user_id"],
    #     "active": False,
    #     "paused": False,
    #     "pauser": None,
    # }
}

def get_user_data(user_id):
    # Reference to the users collection
    users_ref = db.collection('users')
    
    # Fetch the document with the given user_id
    try:
        doc = users_ref.document(user_id).get()
    except Exception as e:
        print("error getting user data:", e)
        return None
    
    # Check if the document exists and return its data
    if doc.exists:
        return doc.to_dict()
    else:
        return None
    
def get_user_ref(user_id):
    # Reference to the users collection
    users_ref = db.collection('users')
    
    # Fetch the document with the given user_id
    doc = users_ref.document(user_id).get()
    
    # Check if the document exists and return its data
    if doc.exists:
        return doc.reference
    else:
        return None
    
def set_game_state(game_id, game_state):
    # Reference to the games collection
    games_ref = db.collection('games')
    
    # Fetch the document with the given game_id
    doc = games_ref.document(game_id).get()
    
    # Check if the document exists and return its data
    if doc.exists:
        doc.reference.update(game_state)
    else:
        # add the game to the database
        games_ref.add(game_state)

def end_game(game_id):
    for user_id in active_games[game_id]["players"]:
        users[user_id]["currentGame"] = None
    for user_id in active_games[game_id]["invited"]:
        users[user_id]["invited"].remove(game_id)
    # Remove the game locally and add it to the database
    active_games[game_id]["active"] = False
    set_game_state(game_id, active_games[game_id])
    active_games[game_id] = None
    emit('status_change', {'status': 'game ended'}, room=game_id)
    emit('game_ended', room=game_id)

@socketio.on('connect')
def on_connect():
    firebase_uid = request.args.get('user_id')
    if firebase_uid == 'undefined':
        return
    socket_session_id = request.sid
    if firebase_uid in users:
        users[firebase_uid]["sid"] = socket_session_id
    else:
        users[firebase_uid] = {
            "sid": socket_session_id,
            "currentGame": None,
            "invited": [],
        }
    print(users)

@socketio.on('disconnect')
def on_disconnect():
    firebase_uid = request.args.get('user_id')
    # if firebase_uid in users:
    #     if users[firebase_uid]["currentGame"]:
    #         leave_room(users[firebase_uid]["currentGame"])
    #     users.pop(firebase_uid)
    print(firebase_uid + ' disconnected')

@socketio.on('create_game')
def create_game(data):
    user_id = data['user_id']
    name = get_user_data(user_id)["name"]
    games_ref = db.collection('games')
    game_state = {
        "creator": user_id,
        "players": [user_id],
        "player_names": [name],
        "invited": [],
        "active": False,
        "paused": False,
        "pauser": None,
    }
    try:
        _, new_game = games_ref.add(game_state)
    except Exception as e:
        print("error adding game:", e)
        return
    game_id = new_game.id
    print("User creating game room:", user_id)
    print("Room:", game_id)
    active_games[game_id] = game_state
    users[user_id]["currentGame"] = game_id
    join_room(game_id)
    emit('game_created', { 'game_id': game_id }, room=game_id)
    emit('player_change', {'players': active_games[game_id]["players"], 'player_names': active_games[game_id]["player_names"] } , room=game_id)
    emit('status_change', {'status': 'game created'}, room=game_id)
    return { 'user_id': user_id, 'game_id': game_id }

@socketio.on('invite_to_game')
def invite_to_game(data):
    user_id = data['user_id']
    invitee_id = data['invitee_id']
    game_id = data['game_id']
    invitee = get_user_data(invitee_id)
    # Invitee not found in Firestore
    if not invitee:
        print('invitee_not_found')
        return
    
    if game_id not in users[invitee_id]["invited"]:
        users[invitee_id]["invited"].append(game_id)
        active_games[game_id]["invited"].append(invitee_id)
        inviter_name = get_user_data(user_id)["name"]
        emit('status_change', {'status': f'{invitee["name"]} invited'}, room=game_id)
        emit('game_invited', { 'inviter_name': inviter_name, 'game_id': game_id }, room=users[invitee_id]["sid"])
        return { 'user_id': user_id, 'invitee_id': invitee_id, 'game_id': game_id }

@socketio.on('leave_game')
def leave_game(data):
    # Only can leave the game if it has not started
    user_id = data['user_id']
    game_id = data['game_id']
    if user_id not in active_games[game_id]["players"]:
        print(f'User {user_id} not in game {game_id}!')
        return
    if len(active_games[game_id]["players"]) == 1:
        # End the game
        active_games[game_id] = None
        # Remove the game from the database
        db.collection('games').document(game_id).delete()
    elif user_id == active_games[game_id]["creator"]:
        # Remove the current user from the game and make another one the creator
        active_games[game_id]["players"].remove(user_id)
        active_games[game_id]["player_names"].remove(get_user_data(user_id)["name"])
        active_games[game_id]["creator"] = active_games[game_id]["players"][0]
    else:
        active_games[game_id]["players"].remove(user_id)
        active_games[game_id]["player_names"].remove(get_user_data(user_id)["name"])
    users[user_id]["currentGame"] = None
    name = get_user_data(user_id)["name"]
    leave_room(game_id)
    emit('player_change', {'players': active_games[game_id]['players'] if active_games[game_id] else [], 
                           'player_names': active_games[game_id]["player_names"] if active_games[game_id] else []} , 
                           room=game_id)
    emit('status_change', {'status': f'{name} left game'}, room=game_id)

@socketio.on('join_game')
def join_game(data):
    # After user accepts invitation
    user_id = data['user_id']
    game_id = data['game_id']
    print(f"User {user_id} joining game {game_id}")
    if user_id not in active_games[game_id]["invited"]:
        print(f'User {user_id} not invited to game {game_id}!')
        return
    active_games[game_id]["invited"].remove(user_id)
    active_games[game_id]["players"].append(user_id)
    active_games[game_id]["player_names"].append(get_user_data(user_id)["name"])
    users[user_id]["invited"].remove(game_id)
    users[user_id]["currentGame"] = game_id
    join_room(game_id)
    name = get_user_data(user_id)["name"]
    emit('player_change', {'players': active_games[game_id]["players"], 'player_names': active_games[game_id]["player_names"]} , room=game_id)
    emit('status_change', {'status': f'{name} joined game'}, room=game_id)

@socketio.on('start_game')
def start_game(data):
    user_id = data['user_id']
    game_id = data['game_id']
    if not game_id or game_id not in active_games:
        print(f'Invalid game ID!')
        return
    if user_id != active_games[game_id]["creator"]:
        print(f'User {user_id} is not the creator of game {game_id}!')
        return
    active_games[game_id]["active"] = True
    emit('game_started', room=game_id)
    emit('status_change', {'status': 'game started'}, room=game_id)

@socketio.on('pause_game')
def pause_game(data):
    user_id = data['user_id']
    game_id = data['game_id']
    if not game_id or game_id not in active_games:
        print(f'Invalid game ID!')
        return False
    if active_games[game_id]["paused"]:
        print(f'Game {game_id} is already paused!')
        return False
    active_games[game_id]["paused"] = True
    active_games[game_id]["pauser"] = user_id
    emit('game_paused', { 'pauser': user_id }, room=game_id)
    name = get_user_data(user_id)["name"]
    emit('status_change', {'status': f'game paused by {name}'}, room=game_id)
    return True

@socketio.on('resume_game')
def resume_game(data):
    user_id = data['user_id']
    game_id = data['game_id']
    if not active_games[game_id]["paused"]:
        print(f'Game {game_id} is not paused!')
        return False
    # Uncomment if we want only the pauser to be able to resume the game
    # if user_id != active_games[game_id]["pauser"]:
    #     print(f'User {user_id} is not the pauser of game {game_id}!')
    #     return False
    active_games[game_id]["paused"] = False
    active_games[game_id]["pauser"] = None
    emit('game_resumed', room=game_id)
    name = get_user_data(user_id)["name"]
    emit('status_change', {'status': f'game resumed by {name}'}, room=game_id)
    return True

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", debug=True)
