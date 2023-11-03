import { Avatar, Button } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import React from 'react';

import type { User } from '@/api';
import {
  acceptFriendRequest,
  fetchUsersWithIds,
  rejectFriendRequest,
} from '@/api';
import { useAuth } from '@/core';
import { EmptyList, showErrorMessage, Text, View } from '@/ui';

export const FriendRequests = () => {
  const [results, setResults] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const user = useAuth().currentUser;

  React.useEffect(() => {
    async function fetchData() {
      if (user !== undefined) {
        await fetchUsersWithIds(user.friendRequests.received).then(
          (requestingUsers) => {
            setResults(requestingUsers);
            setLoading(false);
          }
        );
      }
    }
    fetchData();
  }, [user]);

  const handleAccept = async (senderId: string) => {
    if (user === undefined) return;
    await acceptFriendRequest(senderId, user.id)
      .then(() => {
        setResults((prev) =>
          prev.filter((senderToRemove) => senderToRemove.id !== senderId)
        );
      })
      .catch(() => {
        showErrorMessage(
          'Failed to accept friend request. Please try again later'
        );
      });
  };

  const handleReject = async (senderId: string) => {
    if (user === undefined) return;
    await rejectFriendRequest(senderId, user.id)
      .then(() => {
        setResults((prev) =>
          prev.filter((senderToRemove) => senderToRemove.id !== senderId)
        );
      })
      .catch(() => {
        showErrorMessage(
          'Failed to reject friend request. Please try again later'
        );
      });
  };

  const renderItem = ({ item }: { item: User }) => (
    <View className="flex-row items-center justify-between py-2">
      <View className="mr-2 flex-row items-center space-x-2">
        <Avatar size="medium" rounded source={{ uri: item.photoURL }} />
        <View className="mb-1">
          <Text className="font-bold">{item.name}</Text>
        </View>
      </View>
      <View className="flex-row">
        <Button type="solid" onPress={() => handleAccept(item.id)}>
          Accept
        </Button>
        <Button type="clear" onPress={() => handleReject(item.id)}>
          Reject
        </Button>
      </View>
    </View>
  );

  return (
    <View className="flex-1 px-2">
      <View className="mx-2 h-full min-h-min">
        <FlashList
          data={results}
          renderItem={renderItem}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={
            <EmptyList
              isLoading={loading || user?.friendRequests.received.length === 0}
            />
          }
          estimatedItemSize={15}
        />
      </View>
    </View>
  );
};
