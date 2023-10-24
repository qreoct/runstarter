import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/ui';
import { LoginFormProps } from '../login/login-form';


const schema = z.object({
  name: z.string({
    required_error: 'First Name is required',
  }).optional(),
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

export const SignupForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <View className="flex-1 justify-center p-4">
      <Text testID="form-title" variant="h1" className="pb-6 text-center">
        Sign Up
      </Text>

      <ControlledInput
        testID="name-input"
        control={control}
        name="name"
        label="Name"
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
        label="Submit"
        onPress={handleSubmit(onSubmit)}
        variant="primary"
      />

    </View>
  );
};
