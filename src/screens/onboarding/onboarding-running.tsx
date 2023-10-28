import React from 'react';
import { Button, FocusAwareStatusBar, SafeAreaView, Text, View, ControlledSelect } from '@/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { auth } from 'firebase-config';
import { updateUserPreferences } from '@/database/firestore';
import { GestureResponderEvent } from 'react-native';

const schema = z.object({
  habit: z.string({
    required_error: 'Please enter your current running habits',
  }),
  goal: z
    .number({
      required_error: 'Please enter your desired running frequency',
    })
    .min(1, 'Please enter a number 1 or greater')
    .max(7, 'Please enter a number 7 or less'),
});

export type PreferenceFormType = z.infer<typeof schema>;
export type OnboardingPreferenceProps = {
  onSubmit?: SubmitHandler<PreferenceFormType>;
};

export type OnboardingPreferenceType = z.infer<typeof schema>;

export const OnboardingRunning = () => {
  // const options = ["Less than Once a Week", "1 to 2 times a Week", "3 to 5 times a Week", "5 times a Week or More"];
  // const [selectedOption, setSelectedOption] = useState(String);

  const { handleSubmit, control, getValues } = useForm<OnboardingPreferenceType>({
    resolver: zodResolver(schema),
  });

  interface HabitOption {
    label: string;
    value: string;
  }
  interface GoalOption {
    label: string;
    value: number;
  }

  const habitOptions: HabitOption[] = [
    { label: "Less than Once a Week", value: "Less than Once a Week" },
    { label: "1 to 2 times a Week", value: "1 to 2 times a Week" },
    { label: "3 to 5 times a Week", value: "3 to 5 times a Week" },
    { label: "5 times a Week or More", value: "5 times a Week or More" },
  ];

  const goalOptions: GoalOption[] = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
  ];

  const navigation = useNavigation();
  const onSubmitOnboardingPreference: (event: GestureResponderEvent) => void | undefined = () => {
    if (!auth.currentUser) {
      console.log("NO USER FOUND!");
      return;
    }
    const userId = auth.currentUser.uid;
    updateUserPreferences(userId, getValues('habit'), getValues('goal'));
    navigation.navigate('OnboardingDisclaimer');
  };

  return (
    <View className="flex-1 justify-center p-4">
      <FocusAwareStatusBar />
      <SafeAreaView className="mt-6">
        <Text variant='xl' style={{ fontWeight: 'bold' }} >
          What kind of runner are you?
        </Text>
        <ControlledSelect 
          name="habit" 
          control={control} 
          options={habitOptions} 
          label="I usually run..."
        />
      </SafeAreaView>

      {/* <SafeAreaView className="mt-6">
        {options.map((option) => (
          <Button
            key={option}
            label={option}
            variant={selectedOption === option ? "primary" : "outline"}
            onPress={() => {
              console.log(option);
              setSelectedOption(option);
            }}
          />
        ))}
      </SafeAreaView> */}
      
      <SafeAreaView className="mt-6">
        <Text variant='xl' style={{ fontWeight: 'bold' }}>
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
          onPress={onSubmitOnboardingPreference}
        />
      </SafeAreaView>

    </View>
  );
};
