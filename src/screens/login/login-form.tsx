import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { Divider } from '@rneui/base';
import * as Google from 'expo-auth-session/providers/google';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Image } from 'react-native';
import * as z from 'zod';

import { signin } from '@/core';
import { setOnboarding } from '@/core';
import {
  ANDROID_CLIENT_ID,
  auth,
  IOS_CLIENT_ID,
} from '@/database/firebase-config';
import { addUserIfNotExist, getUserOnboarding } from '@/database/firestore';
import { Button, ControlledInput, Text, View } from '@/ui';

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
  isLoading?: boolean;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const [_userInfo, setUserInfo] = useState<any>(null);
  const [_request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

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
        await addUserIfNotExist(user);
        const userOnboardingState = await getUserOnboarding(user.uid);
        setOnboarding(userOnboardingState);
        signin({
          access: 'access-token',
          refresh: 'refresh-token',
          id: user.uid,
        });
      } else {
        console.log('NO USER');
      }
    });

    return () => unsub();
  }, []);

  return (
    <View className="flex w-screen flex-1 items-center justify-center p-4">
      <Text className="mb-8 text-center text-3xl font-bold">
        Welcome to RunSquad!
      </Text>

      <Image
        source={require('/assets/icon.png')}
        style={{ width: 150, height: 150, alignSelf: 'center' }}
      />

      <EmailPasswordLogin onSubmit={onSubmit} />

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        style={{ width: '100%', height: 60 }}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => promptAsync()}
      />
    </View>
  );
};

const EmailPasswordLogin = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const navigation = useNavigation();
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View className="w-[100%]">
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

      <View className="my-4 flex flex-row items-center justify-center">
        <Divider />
        <Text> Don't have an account? </Text>
        <Divider />
      </View>

      <Button
        testID="signup-button"
        label="Sign Up"
        onPress={navigateToSignup}
        variant="outline"
      />
    </View>
  );
};
