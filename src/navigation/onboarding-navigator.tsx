
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { OnboardingMain, OnboardingRunning } from '@/screens';

export type OnboardingStackParamList = {
  OnboardingMain: undefined;
  OnboardingRunning: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="OnboardingMain" component={OnboardingMain} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingRunning" component={OnboardingRunning} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
