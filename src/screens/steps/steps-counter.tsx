//@ts-nocheck
import {
  FitnessDataType,
  FitnessTracker,
  GoogleFitDataType,
  HealthKitDataType,
} from '@kilohealth/rn-fitness-tracker/';
import React, { useState } from 'react';

import { Pressable, ProgressRing, Text, Value, View } from '@/ui';

const permissions = {
  healthReadPermissions: [HealthKitDataType.StepCount],
  googleFitReadPermissions: [
    GoogleFitDataType.Steps,
    GoogleFitDataType.Calories,
    GoogleFitDataType.Distance,
  ],
};

interface HealthInfoProps {
  steps: number;
  calories: number;
  distance: number;
}

export const StepsCounter = () => {
  const [healthInfo, setHealthInfo] = useState<HealthInfoProps>({
    steps: 0,
    calories: 0,
    distance: 0,
  });

  const getStepsToday = async () => {
    try {
      console.log('connecting to fitness API...');
      await FitnessTracker.UNSAFE_isTrackingAvailable(FitnessDataType.Steps);
      const authorized = await FitnessTracker.authorize(permissions);

      if (!authorized) return;

      const stepsToday = await FitnessTracker.getStatisticTodayTotal(
        FitnessDataType.Steps
      );

      const distanceToday = await FitnessTracker.getStatisticTodayTotal(
        FitnessDataType.Distance
      );

      // returns the number of steps walked today, e.g. 320
      console.log('steps: ' + stepsToday);
      console.log('distance: ' + distanceToday);
      setHealthInfo((prev) => ({
        ...prev,
        steps: stepsToday,
        distance: distanceToday,
      }));
    } catch (error) {
      // Handle error here
      console.log(error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text variant="h1">Steps counter!</Text>
      <View className="py-8">
        <ProgressRing
          progress={healthInfo.steps / (healthInfo.steps * 2 + 1)}
          radius={90}
          strokeWidth={30}
        />
      </View>

      <View className="flex">
        <Value label="Steps" value={healthInfo.steps} />
        {/* <Value label="Calories" value={100} unit="cal" /> */}
        <Value label="Distance" value={healthInfo.distance} unit="m" />
      </View>

      <View className="flex gap-4 py-4">
        <Pressable
          onPress={getStepsToday}
          className="rounded-lg bg-primary-400 p-4"
        >
          <Text className="text-center text-white">Link to Fitness API</Text>
        </Pressable>
      </View>
    </View>
  );
};
