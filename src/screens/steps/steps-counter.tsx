import React from 'react';

import { ProgressRing, Text, Value, View } from '@/ui';

export const StepsCounter = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text variant="h1">Steps counter!</Text>

      <ProgressRing progress={0.4} radius={90} strokeWidth={30} />

      <Value label="Steps" value={100} />
      <Value label="Calories" value={100} unit="cal" />
      <Value label="Distance" value={100} unit="km" />
    </View>
  );
};
