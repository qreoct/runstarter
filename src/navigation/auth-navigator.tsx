import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Login, Signup } from '@/screens';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: true,
          title: 'Create Account',
        }}
      />
    </Stack.Navigator>
  );
};
