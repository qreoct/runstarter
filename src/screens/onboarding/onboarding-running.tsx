import React from 'react';
import { Button, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/ui';

export const OnboardingRunning = () => {
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <Text className="my-3 text-center text-5xl font-bold">
        What kind of runner are you?
      </Text>

      <Text className="mb-2 text-center text-lg text-gray-600">
        I usually run...
      </Text>

      <SafeAreaView className="mt-6">
        <Button
          label="Short Distances"
          variant="outline"
          onPress={() => {
            console.log("Short Distances");
          }}
        />
        <Button
          label="Long Distances"
          variant="outline"
          onPress={() => {
            console.log("Long Distances");
          }}
        />
        <Button
          label="Marathons"
          variant="outline"
          onPress={() => {
            console.log("Marathons");
          }}
        />
      </SafeAreaView>

      <Text className="my-3 text-center text-5xl font-bold">
        What kind of runner do you want to be?
      </Text>

      <Text className="mb-2 text-center text-lg text-gray-600">
        I want to be a...
      </Text>

      <SafeAreaView className="mt-6">
        <Button
          label="Short Distance Runner"
          variant="outline"
          onPress={() => {
            console.log("Short Distance Runner");
          }}
        />
        <Button
          label="Long Distance Runner"
          variant="outline"
          onPress={() => {
            console.log("Long Distance Runner");
          }}
        />
        <Button
          label="Marathon Runner"
          variant="outline"
          onPress={() => {
            console.log("Marathon Runner");
          }}
        />
        <Button
          label="I don't know yet"
          variant="outline"
          onPress={() => {
            console.log("I don't know yet");
          }}
        />
      </SafeAreaView>
    </View>
  );
};
