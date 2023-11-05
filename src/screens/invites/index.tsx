import { ScrollView, Text, View, TouchableOpacity } from '@/ui';
import { Avatar } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Modal, RefreshControl, SafeAreaView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { isEmpty } from 'lodash';
import { NewRun } from '../new_run';
import { ModalHeader } from '@/ui/core/modal/modal-header';

const wait = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const Invites = () => {
  let inviteCount = 8;
  const isEmpty = inviteCount === 0;
  const [refreshing, setRefreshing] = useState(false);
  const [isNewRunModalVisible, setNewRunModalVisible] = useState(false);

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
        {isEmpty ? (
          <View className="p-10 flex justify-center items-center">
            <Ionicons
              name="mail-outline"
              size={50}
              color="gray"
              className="mb-4"
            />
            <Text className="text-lg font-semibold mb-2">No Invites Yet!</Text>
            <Text className="text-center text-sm text-gray-600">
              Looks like your inbox is empty. Swipe down to refresh or invite
              friends to join you!
            </Text>
          </View>
        ) : (
          // Render your list of invites here
          <View className="py-2 flex gap-y-1">
            {[...Array(inviteCount).keys()].map((_, index) => {
              const friends = [
                'Dexter',
                'Jefferson',
                'Joong',
                'Kleon',
                'Glob',
                'Glib',
                'Blib',
                'Blob',
              ];
              return (
                <TouchableOpacity
                  key={index}
                  className="p-4 flex flex-row items-center justify-between"
                  onPress={() => {
                    openNewRunModal();
                  }}
                >
                  <View>
                    <Text className="text-lg font-bold">
                      8x1 minute intervals
                    </Text>
                    <View className="pt-2 flex flex-row">
                      {friends.map((friendName, index) => (
                        <Avatar
                          key={index}
                          size="small"
                          rounded
                          source={{ uri: 'https://picsum.photos/200' }}
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
                      {renderFriendText(friends)}
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
