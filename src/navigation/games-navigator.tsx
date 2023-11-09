import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Invites, NewRun } from '@/screens';
import { Pressable, Text, View } from '@/ui';

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
      <View className="absolute -right-[0.5] -top-[0.5] h-4 w-4 items-center justify-center rounded-full bg-red-600">
        <Text className="text-xs font-bold text-white">1</Text>
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
