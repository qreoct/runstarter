import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Appearance } from 'react-native';

import { useAuth } from '@/core';

import { AuthNavigator } from './auth-navigator';
import { NavigationContainer } from './navigation-container';
import { OnboardingNavigator } from './onboarding-navigator';
import { TabNavigator } from './tab-navigator';

const Stack = createNativeStackNavigator();

export const Root = () => {
  const status = useAuth.use.status();
  const onboardingStatus = useAuth.use.onboardingStatus();
  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      hideSplash();
    }
  }, [hideSplash, status]);

  useEffect(() => Appearance.setColorScheme('light'), []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
      }}
    >
      {status === 'signOut' ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Group>
          {onboardingStatus ? (
            <Stack.Screen name="App" component={TabNavigator} />
          ) : (
            <Stack.Screen
              name="OnboardingNav"
              component={OnboardingNavigator}
            />
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Root />
    </NavigationContainer>
  );
};
