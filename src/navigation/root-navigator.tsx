
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { useAuth } from '@/core';
// import { useIsFirstTime } from '@/core/hooks';

import { AuthNavigator } from './auth-navigator';
import { NavigationContainer } from './navigation-container';
import { OnboardingNavigator } from './onboarding-navigator';
import { TabNavigator } from './tab-navigator';

const Stack = createNativeStackNavigator();

const hasCompletedOnboarding = false;  // Replace this with the logic to check if the user has completed onboarding

export const Root = () => {
  const status = useAuth.use.status();
  // const [isFirstTime] = useIsFirstTime();
  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  
  useEffect(() => {
    if (status !== 'idle') {
      hideSplash();
    }
  }, [hideSplash, status]);

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
        // <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Group>
          {hasCompletedOnboarding ? (    
            <Stack.Screen name="App" component={TabNavigator} />
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          )}
        </Stack.Group>
        // <Stack.Group>
        //   {isFirstTime ? (    

        //   <Stack.Screen name="Onboarding" component={OnboardingNavigator} options={{ headerShown: false }} />
    
        //   ) : (
        //     <Stack.Screen name="App" component={TabNavigator} />
        //   )}
        // </Stack.Group>
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
