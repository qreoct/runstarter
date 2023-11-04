import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { AddFriend, FriendRequests, FriendsFeed } from '@/screens';
import { AddFriend as AddFriendIcon, Pressable } from '@/ui';

export type FriendsStackParamList = {
  FriendsFeed: undefined;
  AddFriend: undefined;
  FriendRequests: undefined;
};

const Stack = createNativeStackNavigator<FriendsStackParamList>();

const GoToAddFriend = () => {
  const { navigate } = useNavigation();
  return (
    <Pressable onPress={() => navigate('AddFriend')} className="p-2">
      <AddFriendIcon />
    </Pressable>
  );
};

export const FriendsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => <GoToAddFriend />,
          title: 'Friends',
        }}
      >
        <Stack.Screen name="FriendsFeed" component={FriendsFeed} />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          title: 'Add Friends',
        }}
      >
        <Stack.Screen name="AddFriend" component={AddFriend} />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          title: 'Friend Requests',
        }}
      >
        <Stack.Screen name="FriendRequests" component={FriendRequests} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
