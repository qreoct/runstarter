import React from 'react';

import { useAuth } from '@/core';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { FocusAwareStatusBar } from '@/ui';

import { LoginForm, LoginFormProps } from './login-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'firebase-config';

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
      // TODO: Display error message to user
    });
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmitLogin}/>
    </>
  );
};
