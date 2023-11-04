import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Profile, Settings } from '@/screens';
import { Pressable, Settings as SettingsIcon } from '@/ui';

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const GoToSettings = () => {
  const { navigate } = useNavigation();
  return (
    <Pressable onPress={() => navigate('Settings')} className="p-2">
      <SettingsIcon />
    </Pressable>
  );
};

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => <GoToSettings />,
        }}
      >
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
