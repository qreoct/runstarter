import React, { useState } from 'react';
import { Modal, Text, View } from 'react-native';

import { Run } from '../run';
import { Button } from '@/ui';
import { createGame, leaveGame, inviteToGame, joinGame, startGame, pauseGame, resumeGame, socket } from 'server/server-utils';

export const ServerTest: React.FC = () => {
  const [roomID, setRoomID] = useState('');
  const [invited, setInvited] = useState(''); 
  const [players, setPlayers] = useState([]);
  const [lastStatus, setLastStatus] = useState('');

  // Can add your own user ID (from Firebase auth page) here for testing.
  // In prod, should query who to invite from friends list
  const idDict = {'KleonNUS': 'VJZF29ubd4PqxRoCzlH6Gnvjsdf2', 
                  'KleonGmail': 'D2zbDPVU39cR5FvA3ihQV21uYfL2',};

  socket.on('game_created', (data: any) => {
    setRoomID(data.game_id);
  });

  socket.on('game_invited', (data: any) => {
    setInvited(data.game_id);
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
      <Button label="Create Game" onPress={() => {
        createGame();
      }} />

      <Button label="Join Game" onPress={() => {
        joinGame(invited);
        setInvited('');
        setRoomID(invited);
      }}
      style={{backgroundColor: invited === '' ? 'black' : 'red'}} />
      
      <Button label="Invite Kleon N" onPress={() => {
        inviteToGame(idDict['KleonNUS'], roomID);
      }} />

      <Button label="Invite Kleon G" onPress={() => {
        inviteToGame(idDict['KleonGmail'], roomID);
      }} />

      <Button label="Start Game" onPress={() => {
        startGame(roomID);
      }} />

      <Button label="Pause Game" onPress={() => {
        pauseGame(roomID);
      }} />

      <Button label="Resume Game" onPress={() => {
        resumeGame(roomID);
      }} />

      <Button label="Leave Game" onPress={() => {
        leaveGame(roomID);
        setRoomID('');
      }} />

      <Text>Room ID: { roomID }</Text>
      <Text>Players: { players } </Text>
      <Text>Last Status: { lastStatus } </Text>
    </View>
  );
};
