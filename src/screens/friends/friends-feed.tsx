import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/base';
import { Button } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect } from 'react';

import type { User } from '@/api';
import { fetchUsersWithIds } from '@/api';
import { useAuth } from '@/core';
import {
  EmptyList,
  FocusAwareStatusBar,
  Image,
  ScrollView,
  Text,
  View,
} from '@/ui';

type Activity = {
  user: User;
  message: string;
  timestamp: string;
  avatar: string;
};

export const FriendsFeed = () => {
  const { navigate } = useNavigation();
  const currentUser = useAuth().currentUser;

  const [activity, setActivity] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const renderIncomingRequestsLength = () => {
    return (
      'Friend Requests ' +
      '(' +
      currentUser?.friendRequests?.received?.length +
      ')'
    );
  };

  useEffect(() => {
    console.log(currentUser);
    if (!currentUser || !currentUser.friends) return;
    // fetchActivityForUsers(ids)
    setLoading(true);
    fetchUsersWithIds(currentUser.friends).then((users) => {
      let friendsActivity: Activity[] = [];
      users.forEach((user) => {
        friendsActivity.push({
          user: user,
          message: 'Hi! I am your friend.',
          avatar: user.photoURL?.toString(),
          timestamp: '',
        });
        setActivity(friendsActivity);
      });
      setLoading(false);
    });
  }, [currentUser, currentUser?.friends]);

  const renderItem = React.useCallback(
    ({ item }: { item: Activity }) => (
      <Card key={item.user.name}>
        <View className="flex flex-row items-center justify-between pb-4">
          <View className="flex flex-row items-center space-x-2">
            <Image
              className="h-10 w-10 rounded-full"
              contentFit="cover"
              source={{ uri: item.avatar }}
            />
            <Text className="font-bold">{item.user.name}</Text>
          </View>
          <View>
            <Text variant="xs">{item.timestamp}</Text>
          </View>
        </View>
        <View>
          <Text>{item.message}</Text>
        </View>
      </Card>
    ),
    []
  );

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="h-full flex-1 p-2">
          {currentUser && currentUser.friendRequests?.received?.length > 0 && (
            <Button type="clear" onPress={() => navigate('FriendRequests')}>
              {renderIncomingRequestsLength()}
            </Button>
          )}
          <FlashList
            data={activity}
            renderItem={renderItem}
            keyExtractor={(_, index) => `item-${index}`}
            ListEmptyComponent={<EmptyList isLoading={loading} />}
            estimatedItemSize={15}
          />
        </View>
      </ScrollView>
    </>
  );
};
