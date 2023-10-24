import React from 'react';

import { useSoftKeyboardEffect } from '@/core/keyboard';
import { FocusAwareStatusBar } from '@/ui';

import { type LoginFormProps } from '../login/login-form';
import { auth } from 'firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { SignupForm } from './signup-form';

export const Signup = () => {
  useSoftKeyboardEffect();

  const onSubmitSignup: LoginFormProps['onSubmit'] = (data) => {
    console.log("Creating new user with: " + JSON.stringify(data));
    createUserWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
      const user = userCredential.user;
      console.log("New user created: " + JSON.stringify(user));
      // Navigate to Login screen
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error creating new user: " + errorCode + ", " + errorMessage);
      // TODO: Display error message to user
    });
  };

  return (
    <>
      <FocusAwareStatusBar />
      <SignupForm onSubmit={onSubmitSignup}/>
    </>
  );
};
