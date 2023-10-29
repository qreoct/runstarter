import React from 'react';
import { Button, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/ui';
import { auth } from 'firebase-config';
import { finishUserOnboarding } from '@/database/firestore';
import { GestureResponderEvent } from 'react-native';
import { setOnboarding } from '@/core';

export const OnboardingDisclaimer = () => {
  const onSubmitOnboardingDisclaimer: (event: GestureResponderEvent) => void | undefined = () => {
    if (!auth.currentUser) {
      console.log("NO USER FOUND!");
      return;
    }
    const userId = auth.currentUser.uid;
    finishUserOnboarding(userId);
    setOnboarding(true);
  };

  const paraMargin = 10
  
  return (
    <View className="flex-1 justify-center p-4">
      <FocusAwareStatusBar />
      <SafeAreaView className="mt-6">
        <Text variant='h2' style={{ fontWeight: 'bold' }} >
        Before we start,{"\n"}here are some rules...
        </Text>
        <Text variant='lg' style={{marginTop: paraMargin}}>
        RunSquad is an outdoor app.
        </Text>
        <Text variant='lg' style={{marginTop: paraMargin}}>
        In completing our mini-games, you are encouraged to explore and interact with your surroundings.
        </Text>
        <Text variant='lg' style={{marginTop: paraMargin}}>
        We want to make sure that you experience RunSquad in a safe and responsible way.
        </Text>
        <Text variant='lg' style={{marginTop: paraMargin}}>
        In using RunSquad, you always agree to observe personal safety and obey all local traffic laws and regulations.
        </Text>
        <Text variant='lg' style={{marginTop: paraMargin}}>
        Only view RunSquad data when it is safe to do so.
        </Text>
        <Text variant='lg' style={{marginTop: paraMargin}}>
        Remember, you are responsible for your own safety.
        </Text>
        
      </SafeAreaView>

      <SafeAreaView className="mt-6">
        <Button
          label="Acknowledge and Proceed"
          onPress={onSubmitOnboardingDisclaimer}
        />
      </SafeAreaView>

    </View>
  );
};
