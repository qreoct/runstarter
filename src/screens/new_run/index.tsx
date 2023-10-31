import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { Run } from '../run';
import { Button } from '@/ui';
import { createGame, leaveGame, inviteToGame, joinGame, startGame, pauseGame, resumeGame, socket } from 'server/server-utils';

export const NewRun: React.FC = () => {
  // state to control modal visibility
  const [isModalVisible, setModalVisibility] = useState(false);

  const handlePress = () => {
    setModalVisibility(!isModalVisible);
  };

  const [roomID, setRoomID] = useState('');
  const [players, setPlayers] = useState([]);
  const [lastStatus, setLastStatus] = useState('');
  const idDict = {'Jeff': 'kQysyUbEChPEt9gvEuLhoCuDaNl2',
                  'Kleon': 'D2zbDPVU39cR5FvA3ihQV21uYfL2',
                  'Dexter': 'vDLWFZf8FUNpqIa5qgupyg1Nmu83' };

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
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          width: 128,
          height: 128,
          borderRadius: 64,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handlePress}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Start</Text>
      </TouchableOpacity>

      {/** Test buttons for client-server interaction */}
      <Button label="Create Game" onPress={() => {
        createGame();
      }} />

      <Button label="Join Game" onPress={() => {
        joinGame(roomID);
      }} />

      <Button label="Invite Jeff" onPress={() => {
        inviteToGame(idDict['Jeff'], roomID);
      }} />

      <Button label="Invite Kleon" onPress={() => {
        inviteToGame(idDict['Kleon'], roomID);
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

      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="slide"
        // onRequestClose={handlePress} // for Android back button
      >
        <View>
          <Run
            onFinish={() => {
              console.log('YO');
              setModalVisibility(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};
