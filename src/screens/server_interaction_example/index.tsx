import React, { useState } from 'react';
import { Text, View } from 'react-native';
import {
  createGame,
  inviteToGame,
  joinGame,
  leaveGame,
  pauseGame,
  resumeGame,
  socket,
  startGame,
} from 'server/server-utils';

import { Button } from '@/ui';
import { useAuth } from '@/core';

interface JoinGameButtonProps {
  roomSetter: (roomId: string) => void;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ roomSetter }) => {
  const [invited, setInvited] = useState('');
  socket.on('game_invited', (data: any) => {
    setInvited(data.game_id);
  });

  return (
    <Button
      label="Join Game"
      onPress={() => {
        joinGame(invited);
        setInvited('');
        roomSetter(invited);
      }}
      style={{ backgroundColor: invited === '' ? 'black' : 'red' }}
    />
  );
};

const InviteButtons: React.FC<{ roomID: string }> = ({ roomID }) => {
  const idDict = {
    KleonNUS: 'VJZF29ubd4PqxRoCzlH6Gnvjsdf2',
    KleonGmail: 'D2zbDPVU39cR5FvA3ihQV21uYfL2',
  };

  return (
    <>
      <Button
        label="Invite Kleon N"
        onPress={() => {
          inviteToGame(idDict.KleonNUS, roomID);
        }}
      />

      <Button
        label="Invite Kleon G"
        onPress={() => {
          inviteToGame(idDict.KleonGmail, roomID);
        }}
      />
    </>
  );
};

export const ServerTest: React.FC = () => {
  const [roomID, setRoomID] = useState('');
  const [players, setPlayers] = useState([]);
  const [lastStatus, setLastStatus] = useState('');
  const userId = useAuth().userId;

  // Can add your own user ID (from Firebase auth page) here for testing.
  // In prod, should query who to invite from friends list

  socket.on('game_created', (data: any) => {
    setRoomID(data.game_id);
  });

  socket.on('player_change', (data: any) => {
    // Get player names from database as data.players are IDs
    setPlayers(data.player_names);
  });

  socket.on('status_change', (data: any) => {
    setLastStatus(data.status);
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/** Test buttons for client-server interaction */}
      <Button
        label="Create Game"
        onPress={() => {
          createGame(userId);
        }}
      />

      <JoinGameButton roomSetter={setRoomID} />

      <InviteButtons roomID={roomID} />

      <Button
        label="Start Game"
        onPress={() => {
          startGame(roomID);
        }}
      />

      <Button
        label="Pause Game"
        onPress={() => {
          pauseGame(roomID);
        }}
      />

      <Button
        label="Resume Game"
        onPress={() => {
          resumeGame(roomID);
        }}
      />

      <Button
        label="Leave Game"
        onPress={() => {
          leaveGame(roomID);
          setRoomID('');
        }}
      />

      <Text>Room ID: {roomID}</Text>
      <Text>Players: {players} </Text>
      <Text>Last Status: {lastStatus} </Text>
    </View>
  );
};
