import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  type RouteProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { Avatar, Button, Icon } from '@rneui/themed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-native';
import {
  createGame,
  endGame,
  inviteToGame,
  joinGame,
  leaveGame,
  socket,
  startGame,
} from 'server/server-utils';

import type { User } from '@/api';
import { fetchUsersWithIds } from '@/api';
import { playStartSound } from '@/audio';
import { useAuth } from '@/core';
import { linkRunToGame } from '@/database';
import type { GamesStackParamList } from '@/navigation/games-navigator';
import {
  FocusAwareStatusBar,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@/ui';
import { GameTypeHeader } from '@/ui/components/game-type-header';
import { games } from '@/ui/components/game-type-header';

import { Run } from '../run';
import { RunReportModal } from '../run_report/run-report-modal';

// from https://reactnavigation.org/docs/typescript/
type GameLobbyProps = RouteProp<GamesStackParamList, 'NewGame'>;

/* eslint-disable max-lines-per-function */
export const NewRun: React.FC<{
  gameId?: string;
  route?: GameLobbyProps;
}> = ({ gameId, route }) => {
  // state to control modal visibility
  const [friends, setFriends] = useState<User[]>([]);
  // hook for friend invites bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const userId = useAuth().userId; // required for creating a game (useAuth::currentUser is null on first render)
  const currentUser = useAuth().currentUser;
  const navigation = useNavigation();
  const [isRunModalVisible, setRunModalVisibility] = useState(false);
  const [runReportId, setRunReportId] = useState<string | null>(null);
  const [roomID, setRoomID] = useState('');
  const [players, setPlayers] = useState<User[]>([]);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [isAwaitingGameStart, setIsAwaitingGameStart] = useState(false);

  useEffect(() => {
    if (!gameId || gameId === '') {
      createGame(userId);
    } else {
      // If a gameId is passed, use it as the roomID
      setRoomID(gameId);
      joinGame(gameId);
    }
  }, [gameId, userId]);

  // Only set up the socket listener for game creation if we are creating a new game
  useEffect(() => {
    if (socket && (!gameId || gameId === '')) {
      const handleGameCreated = (data: any) => {
        setRoomID(data.game_id);
        console.log('game_created', data);
      };

      // Listen for game creation events
      socket.on('game_created', handleGameCreated);

      // Clean up the listener when the component is unmounted or if the gameId changes
      return () => {
        if (socket) {
          socket.off('game_created', handleGameCreated);
        }
      };
    }
  }, [gameId]);

  useEffect(() => {
    if (socket) {
      const handlePlayerChange = async (data: any) => {
        const newPlayers = await fetchUsersWithIds(data.players);
        setPlayers(newPlayers);
      };

      const handleGameStarted = async (_data: any) => {
        // Play game-start sound and start 5 sec countdown
        playStartSound();
        setIsAwaitingGameStart(true);
        setTimeout(() => {
          setRunModalVisibility(true);
          setIsAwaitingGameStart(false);
        }, 5000);
      };

      socket.on('player_change', handlePlayerChange);
      socket.on('game_started', handleGameStarted);

      return () => {
        if (socket) {
          socket.off('player_change', handlePlayerChange);
          socket.off('game_started', handleGameStarted);
        }
      };
    }
  }, []);

  const resetGame = () => {
    console.log('Resetting game...');
    // Reset game room
    setRoomID('');
    setPlayers([]);
    setInvitedIds([]);
    // Navigate back to home screen
    navigation.navigate('Games'); // Already in 'Games'
    gameId = createGame(userId);
  };

  const handleSheetChange = useCallback(() => {
    if (!currentUser || currentUser.friends?.length === 0) return;
    // fetchActivityForUsers(ids)
    fetchUsersWithIds(currentUser.friends).then((res) => setFriends(res));
  }, [currentUser]);

  const renderFriendInviteRow = ({ item }: { item: User }) => {
    const isInvited = invitedIds.includes(item.id);
    return (
      <View className="flex-row items-center justify-between py-2">
        <View className="mr-2 flex-row items-center space-x-2">
          <Avatar
            size="medium"
            rounded
            source={{ uri: item.photoURL ?? 'https://picsum.photos/200' }}
          />
          <View className="mb-1">
            <Text className="font-bold">
              {item.name} {item.id.slice(0, 5)}
            </Text>
          </View>
        </View>
        <Button
          type="solid"
          onPress={() => {
            if (roomID) {
              inviteToGame(item.id, roomID);
              setInvitedIds((ids) => [...ids, item.id]);
            }
          }}
          disabled={isInvited}
        >
          {isInvited ? 'Pending' : 'Invite'}
        </Button>
      </View>
    );
  };

  return (
    <View className="flex h-full">
      <FocusAwareStatusBar hidden={isRunModalVisible} />
      <GameTypeHeader gameType={route?.params.gameType} />
      <View className="flex flex-1">
        <Text className="pl-6 pt-2 text-xl font-extrabold">
          The Run Squad ({players.length} 👤)
        </Text>
        <Text className="text-md pl-6 text-gray-500">
          Room: {players.length === 0 ? 'Creating...' : roomID.slice(0, 5)}
        </Text>
        <View className="flex p-6">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex gap-x-4 px-4"
          >
            {players.map((player, index) => (
              <View
                key={index}
                className="flex w-24 items-center justify-center gap-2"
              >
                <Image
                  source={{
                    uri: player.photoURL ?? 'https://picsum.photos/200',
                  }}
                  className="h-20 w-20 rounded-full"
                />
                <Text className="text-xs font-normal" numberOfLines={1}>
                  {player.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View className="flex flex-row items-center justify-center space-x-2 py-4">
        <View className="flex">
          <TouchableOpacity
            className="flex flex-row items-center justify-center rounded-full bg-neutral-100 px-4"
            onPress={() => {
              sheetRef.current?.expand();
            }}
          >
            <Icon name="person-add" type="ionicon" />
            <Text className="text-md px-4 py-2 font-medium">Invite</Text>
          </TouchableOpacity>
        </View>
        <View className="flex">
          <TouchableOpacity
            className={`flex h-28 w-28 items-center justify-center rounded-full ${
              isAwaitingGameStart ? 'bg-gray-400' : 'bg-green-400'
            }`}
            disabled={isAwaitingGameStart}
            onPress={() => {
              startGame(roomID);
            }}
          >
            <Text className="text-xl font-extrabold italic">START</Text>
          </TouchableOpacity>
        </View>
        <View className="flex">
          <TouchableOpacity
            className="flex flex-row items-center justify-center rounded-full bg-neutral-100 px-4"
            onPress={() => {
              leaveGame(roomID);
              navigation.dispatch(StackActions.pop());
            }}
          >
            <Icon name="exit-outline" type="ionicon" />
            <Text className="text-md px-4 py-2 font-medium">Quit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isRunModalVisible}
        transparent={false}
        animationType="slide"
        // onRequestClose={handlePress} // for Android back button
      >
        <View>
          <Run
            gameId={roomID}
            players={players}
            gameType={route?.params.gameType as keyof typeof games}
            numIntervals={games[route?.params.gameType as keyof typeof games].data.numIntervals}
            intervalDurationMs={games[route?.params.gameType as keyof typeof games].data.intervalDurationMs}
            onFinish={(runId) => {
              setRunModalVisibility(false);
              setRunReportId(runId);
              endGame(roomID);
              linkRunToGame(currentUser!.id, runId!, roomID);
            }}
          />
        </View>
      </Modal>

      <Modal
        visible={!!runReportId}
        transparent={false}
        animationType="slide"
        // onRequestClose={handlePress} // for Android back button
      >
        <View>
          <RunReportModal
            gameId={roomID}
            runId={runReportId!}
            onFinish={() => {
              setRunReportId(null);
              setRunModalVisibility(false);
              console.log('toggle modal');
              resetGame();
              console.log('reset game');
            }}
          />
        </View>
      </Modal>

      {/* Invite Friend */}
      <BottomSheet
        ref={sheetRef}
        onChange={handleSheetChange}
        snapPoints={['75%']}
        index={-1}
        enablePanDownToClose={true}
      >
        <Text variant="h3" className="text-center font-bold">
          Invite Friends
        </Text>
        <BottomSheetFlatList
          data={friends}
          keyExtractor={(i) => i.id}
          renderItem={renderFriendInviteRow}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </BottomSheet>
    </View>
  );
};
