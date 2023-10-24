import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import * as Google from 'expo-auth-session/providers/google';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../../firebase-config';

import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/ui';
import { useAuth } from '@/core';

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

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      '923831664425-9crg238fbqfe2g5ktgdoeg6ao9ktisan.apps.googleusercontent.com',
    androidClientId:
      '923831664425-qjmcljl658jb59hed6eopg4hc5vbn08t.apps.googleusercontent.com',
  });
  const signIn = useAuth.use.signin();
  const navigation = useNavigation();

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('USER: ' + JSON.stringify(user));
        setUserInfo(user);
        signIn({ access: 'access-token', refresh: 'refresh-token' });
      } else {
        console.log('NO USER');
      }
    });

    return () => unsub();
  }, []);

  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <View className="flex-1 justify-center p-4">
      <Text testID="form-title" variant="h1" className="pb-6 text-center">
        Sign In
      </Text>

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
        testID="login-button"
        label="Login"
        onPress={handleSubmit(onSubmit)}
        variant="primary"
      />

      <Button
        testID="signup-button"
        label="Sign Up"
        onPress={navigateToSignup}
        variant="outline"
      />

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => promptAsync()}
      />
    </View>
  );
};
