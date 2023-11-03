import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { auth } from '@/database/firebase-config';
import { updateUserPreferences } from '@/database/firestore';
import {
  Button,
  ControlledSelect,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/ui';

const schema = z.object({
  habit: z.string({
    required_error: 'Please select your current running habits',
  }),
  goal: z.number({
    required_error: 'Please select your desired running frequency',
  }),
});

export type PreferenceFormType = z.infer<typeof schema>;
export type OnboardingPreferenceProps = {
  onSubmit?: SubmitHandler<PreferenceFormType>;
};

export type OnboardingPreferenceType = z.infer<typeof schema>;

interface HabitOption {
  label: string;
  value: string;
}
interface GoalOption {
  label: string;
  value: number;
}

const habitOptions: HabitOption[] = [
  { label: 'Less than Once a Week', value: 'Less than Once a Week' },
  { label: '1 to 2 times a Week', value: '1 to 2 times a Week' },
  { label: '3 to 5 times a Week', value: '3 to 5 times a Week' },
  { label: '5 times a Week or More', value: '5 times a Week or More' },
];

const goalOptions: GoalOption[] = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
];

export const OnboardingRunning = () => {
  const { handleSubmit, control } = useForm<OnboardingPreferenceType>({
    resolver: zodResolver(schema),
  });

  const navigation = useNavigation();
  const onSubmitOnboardingPreference: OnboardingPreferenceProps['onSubmit'] = (
    data
  ) => {
    if (!auth.currentUser) {
      console.log('NO USER FOUND!');
      return;
    }
    const userId = auth.currentUser.uid;
    updateUserPreferences(userId, data.habit, data.goal);
    navigation.navigate('OnboardingDisclaimer');
  };

  return (
    <View className="flex-1 justify-center p-4">
      <FocusAwareStatusBar />
      <SafeAreaView className="mt-6">
        <Text variant="xl" style={{ fontWeight: 'bold' }}>
          What kind of runner are you?
        </Text>
        <ControlledSelect
          name="habit"
          control={control}
          options={habitOptions}
          label="I usually run..."
        />
      </SafeAreaView>

      <SafeAreaView className="mt-6">
        <Text variant="xl" style={{ fontWeight: 'bold' }}>
          What kind of runner do you want to be?
        </Text>

        <ControlledSelect
          name="goal"
          control={control}
          options={goalOptions}
          label="I want to run __ time(s) a week:"
        />
      </SafeAreaView>

      <SafeAreaView className="mt-6">
        <Button
          label="Next"
          onPress={handleSubmit(onSubmitOnboardingPreference)}
        />
      </SafeAreaView>
    </View>
  );
};
