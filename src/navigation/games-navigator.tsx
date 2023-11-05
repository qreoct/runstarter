import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { NewRun } from '@/screens';

export type GamesStackParamList = {
  Games: undefined;
};

const Stack = createNativeStackNavigator<GamesStackParamList>();

export const GamesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{}}>
        <Stack.Screen name="Games" component={NewRun} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
