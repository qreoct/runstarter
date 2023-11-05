import { ScrollView, Text, View, TouchableOpacity } from '@/ui';
import { Avatar } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Modal, RefreshControl, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NewRun } from '../new_run';
import { ModalHeader } from '@/ui/core/modal/modal-header';
import { db } from '@/database/firebase-config'; 
import { onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from '@/core';
import { Game, fetchGameWithId } from '@/database/games';
import { fetchUsersWithIds } from '@/api';

const wait = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const Invites = () => {
  const currentUser = useAuth().currentUser;
  const [refreshing, setRefreshing] = useState(false);
  const [isNewRunModalVisible, setNewRunModalVisible] = useState(false);
  const [invitedGameIDs, setInvitedGameIDs] = useState<string[]>([]);
  const [invitedGames, setInvitedGames] = useState<any[]>([]);

  // Function to handle the opening of the NewRun modal
  const openNewRunModal = () => {
    setNewRunModalVisible(true);
  };

  const renderFriendText = (friends: string[]) => {
    // If there are 4 or less friends, join them by ", " and "and".
    if (friends.length <= 4) {
      return friends.join(', ').replace(/, ([^,]*)$/, ' and $1'); // Regex to replace last comma with ' and'
    }

    // If there are more than 4 friends, list the first four and the number of others.
    const firstFourFriends = friends.slice(0, 4).join(', ');
    const othersCount = friends.length - 4;
    return `${firstFourFriends}, and ${othersCount} other${
      othersCount > 1 ? 's' : ''
    }`;
  };

  // Subscribe to invited games from firebase
  useEffect(() => {
    if (!currentUser?.id) return;
    const userRef = doc(db, 'users', currentUser.id);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const updatedInvitedGames = userData?.invitedGames || [];
        setInvitedGameIDs(updatedInvitedGames);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const fetchGames = async () => {
      if (invitedGameIDs.length === 0) {
        setInvitedGames([]);
        return;
      }
  
      try {
        // Fetch all game details simultaneously with Promise.all
        const gameDetailsPromises = invitedGameIDs.map(gameId => fetchGameWithId(gameId));
        const gameDetails = await Promise.all(gameDetailsPromises);
  
        // Now that we have all game details, fetch user details for each game
        const gamesWithUserDetails = await Promise.all(gameDetails.map(async (game) => {
          if (game.players) {
            const userDetailPromises = game.players.map(userId => fetchUsersWithIds([userId]));
            const userDetails = await Promise.all(userDetailPromises);
            return { ...game, players: userDetails.flat() }; // flat() is used in case fetchUsersWithIds returns an array for each user
          }
          return game;
        }));
  
        setInvitedGames(gamesWithUserDetails);
      } catch (error) {
        // Handle errors, e.g., show an error message
        console.error('Failed to fetch game details:', error);
      }
    };
  
    fetchGames();
  }, [invitedGameIDs]);

  return (
    <View>
      <ScrollView
        className="h-full"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              wait(2000).then(() => setRefreshing(false));
            }}
          />
        }
        // className can be added here if you're using a utility like Tailwind CSS or Styled Components
      >
        {invitedGameIDs.length == 0 ? (
          <View className="p-10 flex justify-center items-center">
            <Ionicons
              name="mail-outline"
              size={50}
              color="gray"
              className="mb-4"
            />
            <Text className="text-lg font-semibold mb-2">No Invites Yet!</Text>
            <Text className="text-center text-sm text-gray-600">
              Looks like you have no game invites. Swipe down to refresh or ask
              a friend to invite you to a game!
            </Text>
          </View>
        ) : (
          // Render your list of invites here
          <View className="py-2 flex gap-y-1">
            {invitedGames.map((game, index) => {
              // Fetch game data from firebase
              const friends = game.players ?? [];
              return (
                <TouchableOpacity
                  key={index}
                  className="p-4 flex flex-row items-center justify-between"
                  onPress={() => {
                    openNewRunModal();
                  }}
                >
                  <View>
                    <Text className="text-lg font-bold"> {/** Change to game id / settings? */}
                      8x1 minute intervals
                    </Text>
                    <View className="pt-2 flex flex-row">
                      {friends.map((friend: any, index: any) => (
                        <Avatar
                          key={index}
                          size="small"
                          rounded
                          source={{ uri: friend.photoURL ?? 'https://picsum.photos/200' }}
                          containerStyle={{
                            marginLeft: index === 0 ? 0 : -10, // Overlap effect here, adjust as necessary
                            zIndex: 4 - index, // Ensures the leftmost avatar is on top
                            borderColor: 'white', // White border color
                            borderWidth: 2, // Border width
                            borderStyle: 'solid', // Border style
                          }}
                        />
                      ))}
                    </View>
                    <Text className="pt-2 text-sm font-medium text-neutral-600">
                      {renderFriendText(friends.map((friend: any) => friend.name))}
                    </Text>
                  </View>
                  <View>
                    <Ionicons name="chevron-forward-outline" size={20} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
      <Modal
        visible={isNewRunModalVisible}
        transparent={false}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ModalHeader
            title=""
            dismiss={() => {
              setNewRunModalVisible(false);
            }}
          />
          <View style={{ flex: 1 }}>
            <NewRun />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};
