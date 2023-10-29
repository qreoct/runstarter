import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import { useSoftKeyboardEffect } from '@/core/keyboard';
import { auth } from '@/database/firebase-config';
import { FocusAwareStatusBar } from '@/ui';

import { type LoginFormProps } from '../login/login-form';
import { SignupForm } from './signup-form';

export const Signup = () => {
  useSoftKeyboardEffect();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitSignup: LoginFormProps['onSubmit'] = (data) => {
    console.log('Creating new user with: ' + JSON.stringify(data));
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setIsLoading(false);
        console.log('New user created: ' + JSON.stringify(user));
        // Navigate to Login screen
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(
          'Error creating new user: ' + errorCode + ', ' + errorMessage
        );
        // Display error message to user
        setIsLoading(false);
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert(
            'Error creating new user',
            'This email has already been used! Please try again with a different email.'
          );
        } else {
          Alert.alert(
            'Generic error creating new user ',
            'Error creating your account, please try again later!'
          );
        }
      });
  };

  return (
    <>
      <FocusAwareStatusBar />
      <SignupForm onSubmit={onSubmitSignup} isLoading={isLoading} />
    </>
  );
};
