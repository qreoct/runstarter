import { auth } from '@/database';
import { io } from 'socket.io-client';


export let socket: any;

export const initializeSocket = () => {
  if (!socket) {
    // Replace the IP address with your own public IP address for testing
    socket = io("https://runsquad-02386feb1781.herokuapp.com", {
      transports: ["websocket"],
      query: {
        user_id: auth.currentUser?.uid
      }
    });

    // Event listeners
    socket.on('connect', () => {
      console.log('Connected to server!'); 
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server!');
    });
    
    socket.on('game_invited', (data: any) => {
      console.log('You have been invited to a game by ' + data.inviter_name + '!');
      console.log(data);
    });
    
    socket.on('game_started', (data: any) => { 
      console.log('Game started on server!');
      console.log(data);
    });        
            
    socket.on('game_ended', (data: any) => { 
      console.log('Game ended on server!');
      console.log(data);
    });
    
    socket.on('game_paused', (data: any) => { 
      console.log('Game paused on server by ' + data.pauser + ' !');
      console.log(data);
    });
    
    socket.on('game_resumed', (data: any) => { 
      console.log('Game resumed on server!');
      console.log(data);
    });
  }
  return socket;
}

export const deinitializeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export const createGame = () => {
  if (!auth.currentUser) {
    console.log('NO USER FOUND!');
    return;
  }
  var gameID = "";
  socket.emit('create_game', { 'user_id': auth.currentUser.uid }, (data: any) => {
    console.log("Returned data:", data);
    gameID = data.game_id;
  });
  console.log('Joining room...');
  return gameID
}

export const leaveGame = (gameID: string) => {
  if (!auth.currentUser) {
    console.log('NO USER FOUND!');
    return;
  }
  socket.emit('leave_game', { 'user_id': auth.currentUser.uid , 'game_id': gameID }, (data: any) => {
    console.log(data);
  });
  console.log('Leaving room...');
}

export const inviteToGame = (inviteeID: string, gameID: string) => {
  if (!auth.currentUser) {
    console.log('NO USER FOUND!');
    return;
  }
  socket.emit('invite_to_game', { 'user_id': auth.currentUser.uid, 'invitee_id': inviteeID, 'game_id': gameID }, (data: any) => {
    console.log(data);
  });
  console.log('Inviting to room...');
}

export const joinGame = (gameID: string) => {
  if (!auth.currentUser) {
    console.log('NO USER FOUND!');
    return;
  }
  socket.emit('join_game', { 'user_id': auth.currentUser.uid, 'game_id': gameID }, (data: any) => {
    console.log(data);
  });
  console.log('Joining room...');
}

export const startGame = (gameID: string) => {
  if (!auth.currentUser) {
    console.log('NO USER FOUND!');
    return;
  }
  socket.emit('start_game', { 'user_id': auth.currentUser.uid, 'game_id': gameID }, (data: any) => {
    console.log(data);
  });
  console.log('Starting game...');
}

export const pauseGame = (gameID: string) => {
  if (!auth.currentUser) {
    console.log('NO USER FOUND!');
    return;
  }
  socket.emit('pause_game', { 'user_id': auth.currentUser.uid, 'game_id': gameID }, (data: any) => {
    console.log(data);
  });
  console.log('Pausing game...');
}

export const resumeGame = (gameID: string) => {
  if (!auth.currentUser) {
    console.log('NO USER FOUND!');
    return;
  }
  socket.emit('resume_game', { 'user_id': auth.currentUser.uid, 'game_id': gameID }, (data: any) => {
    console.log(data);
  });
  console.log('Resuming game...');
}
