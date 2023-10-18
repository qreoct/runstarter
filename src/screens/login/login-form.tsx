import { zodResolver } from '@hookform/resolvers/zod';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/ui';

const schema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <View className="flex-1 justify-center p-4">
      <Text testID="form-title" variant="h1" className="pb-6 text-center">
        Sign In
      </Text>

      <ControlledInput
        testID="name"
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
        placeholder="***"
        secureTextEntry={true}
      />
      <Button
        testID="login-button"
        label="Login"
        onPress={handleSubmit(onSubmit)}
        variant="primary"
      />

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => {
          GoogleSignin.configure({
            iosClientId:
              '450135274692-v9ausg86i4kjll0mphd0mrlo9520dlb4.apps.googleusercontent.com',
          });
          GoogleSignin.hasPlayServices()
            .then((hasPlayService) => {
              if (hasPlayService) {
                GoogleSignin.signIn()
                  .then((userInfo) => {
                    console.log(JSON.stringify(userInfo));
                    // Call handleSubmit with the userInfo
                    handleSubmit(onSubmit)({
                      name: userInfo.user.name,
                      email: userInfo.user.email,
                    });
                  })
                  .catch((e) => {
                    console.log('ERROR IS: ' + JSON.stringify(e));
                  });
              }
            })
            .catch((e) => {
              console.log('ERROR IS: ' + JSON.stringify(e));
            });
        }}
      />
    </View>
  );
};
