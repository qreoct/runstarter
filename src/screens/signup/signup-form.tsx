import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, ControlledInput, Image, Text, View } from '@/ui';

import type { LoginFormProps } from '../login/login-form';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters'),
});

export type FormType = z.infer<typeof schema>;

export const SignupForm = ({
  onSubmit = () => {},
  isLoading,
}: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-center text-3xl font-bold">Sign Up</Text>
      <View className="flex items-center">
        <Text className="mb-8 w-80 items-center text-center">
          Ready to turn your miles into smiles? {'\n'} Join the latest social
          running app to enjoy minigames and rewards!
        </Text>
      </View>
      <Image
        source={require('/assets/images/Running.png')}
        style={{
          width: '80%',
          height: 150,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 20,
        }}
      />

      <ControlledInput
        testID="email-input"
        control={control}
        name="email"
        label="Email"
      />
      <ControlledInput
        testID="password-input"
        control={control}
        name="password"
        label="Password"
        placeholder="********"
        secureTextEntry={true}
      />

      <Button
        testID="signup-submit-button"
        label="Create Account"
        onPress={handleSubmit(onSubmit)}
        variant="primary"
        disabled={isLoading}
      />
    </View>
  );
};
