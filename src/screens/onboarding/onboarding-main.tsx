import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useSoftKeyboardEffect } from '@/core/keyboard';
import { auth } from '@/database/firebase-config';
import { updateUserParticulars } from '@/database/firestore';
import {
  Button,
  ControlledInput,
  ControlledSelect,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/ui';

const schema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  age: z
    .string({
      required_error: 'Age is required',
    })
    .regex(/^[0-9]+$/, 'Age must be a number'),
  gender: z.string({
    required_error: 'Gender is required',
  }),
});

export type FormType = z.infer<typeof schema>;
export type OnboardingFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading?: boolean;
};

export type OnboardingFormType = z.infer<typeof schema>;

export const OnboardingForm = ({
  onSubmit = () => {},
  isLoading,
}: OnboardingFormProps) => {
  interface Option {
    label: string;
    value: string;
  }

  const genderOptions: Option[] = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
  ];

  const { handleSubmit, control } = useForm<OnboardingFormType>({
    resolver: zodResolver(schema),
  });

  return (
    <View className="flex-1 justify-center p-4">
      <FocusAwareStatusBar />
      <SafeAreaView className="mt-6">
        <Text variant="h1" style={{ fontWeight: 'bold' }}>
          Welcome to RunSquad!
        </Text>
        <Text variant="lg">
          We're glad to have you on board. Let's get to know you a little
          better!
        </Text>
      </SafeAreaView>

      <SafeAreaView className="mt-6">
        <ControlledInput
          testID="name-input"
          control={control}
          name="name"
          label="Name"
        />
        <ControlledInput
          testID="age-input"
          control={control}
          name="age"
          label="Age"
        />
        <ControlledSelect
          name="gender"
          control={control}
          options={genderOptions}
          label="Gender"
        />
      </SafeAreaView>

      <SafeAreaView className="mt-6">
        <Button
          label="Next"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </SafeAreaView>
    </View>
  );
};

export const Onboarding = () => {
  useSoftKeyboardEffect();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitOnboarding: OnboardingFormProps['onSubmit'] = (data) => {
    setIsLoading(true);
    if (!auth.currentUser) {
      console.log('NO USER FOUND!');
      return;
    }
    const userId = auth.currentUser.uid;
    updateUserParticulars(userId, data);
    setIsLoading(false);
    navigation.navigate('OnboardingRunning');
  };

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <OnboardingForm onSubmit={onSubmitOnboarding} isLoading={isLoading} />
    </View>
  );
};
