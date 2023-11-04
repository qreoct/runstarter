import { Avatar, Button, SearchBar } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { useAuth } from '@/core';
import useDebounce from '@/core/hooks/use-debounce';
import type { User } from '@/database';
import { fetchUsers } from '@/database';
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from '@/database/users/friend-requests';
import { EmptyList, showErrorMessage, Text, View } from '@/ui';

/* eslint-disable max-lines-per-function */
export const AddFriend = () => {
  const [search, setSearch] = React.useState<string>('');
  const [results, setResults] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pendingIds, setPendingIds] = React.useState<string[]>([]);
  const [receivedIds, setReceivedIds] = React.useState<string[]>([]);

  const debouncedSearch = useDebounce(search, 500);
  const currentUserUid = useAuth().userId;

  const currentUser = useAuth().currentUser;

  React.useEffect(() => {
    setPendingIds(currentUser?.friendRequests?.pending ?? []);
    setReceivedIds(currentUser?.friendRequests?.received ?? []);
  }, [currentUser]);

  React.useEffect(() => {
    async function makeAPICall() {
      setLoading(true);
      await fetchUsers(debouncedSearch)
        .then((users) => {
          setResults(
            users.filter(
              (user) =>
                user.id !== currentUserUid &&
                !currentUser?.friends?.includes(user.id)
            )
          );
          setLoading(false);
        })
        .catch((err) => {
          showErrorMessage('Failed to fetch users.' + err);
        });
    }
    makeAPICall();
  }, [debouncedSearch, currentUserUid, currentUser?.friends]);

  const handleAddFriend = React.useCallback(
    async (receiver: User) => {
      await sendFriendRequest(currentUserUid, receiver)
        .then(() => {
          showMessage({ message: 'Friend request sent' });
          setPendingIds((prev) => [...prev, receiver.id]);
        })
        .catch((err) => {
          showErrorMessage('Error sending friend request' + err);
        });
    },
    [currentUserUid]
  );

  const updateSearch = (query: string) => {
    setSearch(query);
  };

  const cancelSearch = () => {
    setSearch('');
    setResults([]);
  };

  const handleAccept = async (senderId: string) => {
    if (currentUser === undefined) return;
    await acceptFriendRequest(currentUser.id, senderId)
      .then(() => {
        setPendingIds((prev) =>
          prev.filter((senderToRemove) => senderToRemove !== senderId)
        );
        setReceivedIds((prev) =>
          prev.filter((senderToRemove) => senderToRemove !== senderId)
        );
      })
      .catch(() => {
        showErrorMessage(
          'Failed to accept friend request. Please try again later'
        );
      });
  };

  const handleReject = async (senderId: string) => {
    if (currentUser === undefined) return;
    await rejectFriendRequest(senderId, currentUser.id)
      .then(() => {
        setPendingIds((prev) =>
          prev.filter((senderToRemove) => senderToRemove !== senderId)
        );
        setReceivedIds((prev) =>
          prev.filter((senderToRemove) => senderToRemove !== senderId)
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
      {pendingIds.includes(item.id) && (
        <Button type="clear" onPress={() => handleReject(item.id)}>
          Pending
        </Button>
      )}
      {receivedIds.includes(item.id) && (
        <Button type="clear" onPress={() => handleAccept(item.id)}>
          Accept
        </Button>
      )}
      {!pendingIds.includes(item.id) && !receivedIds.includes(item.id) && (
        <Button type="solid" onPress={() => handleAddFriend(item)}>
          Add
        </Button>
      )}
    </View>
  );

  return (
    <View className="flex-1 px-2">
      {/* <Text>current User Uid: [{currentUserUid}]</Text>
      <Text>friends: [{currentUser?.friends}]</Text> */}
      <SearchBar
        placeholder="Search by name..."
        onChangeText={updateSearch}
        value={search}
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        onCancel={cancelSearch}
        showLoading={loading}
      />
      <View className="mx-2 h-full min-h-min">
        {results && results.length > 0 ? (
          <FlashList
            data={results}
            renderItem={renderItem}
            keyExtractor={(_, index) => `item-${index}`}
            extraData={[pendingIds, receivedIds]}
            ListEmptyComponent={<EmptyList isLoading={loading} />}
            estimatedItemSize={15}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};
