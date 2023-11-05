import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Invites, NewRun } from '@/screens';
import { Pressable, Text, View } from '@/ui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export type GamesStackParamList = {
  Games: undefined;
  Invites: undefined;
};

const Stack = createNativeStackNavigator<GamesStackParamList>();

const GoToInvites = () => {
  const { navigate } = useNavigation();
  return (
    <Pressable onPress={() => navigate('Invites')} className="p-2">
      <Ionicons name="mail-open-outline" size={24} />
      <View className="absolute -top-[0.5] -right-[0.5] bg-red-600 rounded-full w-4 h-4 justify-center items-center">
        <Text className="text-white text-xs font-bold">1</Text>
      </View>
    </Pressable>
  );
};

export const GamesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => <GoToInvites />,
        }}
      >
        <Stack.Screen name="Games" component={NewRun} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="Invites" component={Invites} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
