import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { Alert } from 'react-native';

import { useAuth } from '@/core';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { auth } from '@/database/firebase-config';
import { addUserIfNotExist } from '@/database/firestore';
import { FocusAwareStatusBar } from '@/ui';

import type { LoginFormProps } from './login-form';
import { LoginForm } from './login-form';

export const Login = () => {
  const signIn = useAuth.use.signin();
  useSoftKeyboardEffect();

  const onSubmitLogin: LoginFormProps['onSubmit'] = (data) => {
    console.log('onSubmitLogin:\n' + JSON.stringify(data));
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        if (auth.currentUser) {
          addUserIfNotExist(auth.currentUser.uid);
        }
        signIn({
          access: 'access-token',
          refresh: 'refresh-token',
          id: auth.currentUser?.uid || '',
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error signing in: ' + errorCode + ', ' + errorMessage);
        // Display error message to user
        if (errorCode === 'auth/invalid-login-credentials') {
          Alert.alert(
            'Error signing in',
            'Wrong email or password. Ensure that you have an account, or sign up below, then try again with the right email and password!'
          );
        } else {
          Alert.alert(
            'Generic error signing in',
            'Error signing in, please try again later!'
          );
        }
      });
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmitLogin} />
    </>
  );
};
