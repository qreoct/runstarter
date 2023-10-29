import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Onboarding, OnboardingDisclaimer, OnboardingRunning } from '@/screens';

export type OnboardingStackParamList = {
  Onboarding: undefined;
  OnboardingRunning: undefined;
  OnboardingDisclaimer: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingRunning"
        component={OnboardingRunning}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingDisclaimer"
        component={OnboardingDisclaimer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
