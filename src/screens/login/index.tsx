import React from 'react';

import { useAuth } from '@/core';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { FocusAwareStatusBar } from '@/ui';

import { LoginForm, LoginFormProps } from './login-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'firebase-config';
import { Alert } from 'react-native';

export const Login = () => {
  const signIn = useAuth.use.signin();
  useSoftKeyboardEffect();

  const onSubmitLogin: LoginFormProps['onSubmit'] = (data) => {
    console.log("onSubmitLogin:\n" + JSON.stringify(data));
    signInWithEmailAndPassword(auth, data.email, data.password).then(() => {
      signIn({ access: 'access-token', refresh: 'refresh-token' })
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error signing in: " + errorCode + ", " + errorMessage);
      // Display error message to user
      if (errorCode === "auth/invalid-login-credentials") {
        Alert.alert("Error signing in", "Wrong email or password. Ensure that you have an account, or sign up below, then try again with the right email and password!");
      } else {
        // Strip the "auth/" prefix from the error code
        Alert.alert("Generic error signing in", "Error signing in, please try again later!");
      }
    });
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmitLogin}/>
    </>
  );
};
