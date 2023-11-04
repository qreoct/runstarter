import { signOut } from 'firebase/auth';
import { deinitializeSocket, initializeSocket } from 'server/server-utils';
import { create } from 'zustand';

import { auth } from '@/database/firebase-config';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import {
  getOnboardingToken,
  getToken,
  removeOnboardingToken,
  removeToken,
  setOnboardingToken,
  setToken,
} from './utils';

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  onboardingStatus: boolean;
  onboardingToken: TokenType | null;
  signin: (data: TokenType) => void;
  signout: () => void;
  hydrate: () => void;
  setOnboarding: (bool: boolean) => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  onboardingStatus: false,
  onboardingToken: null,
  signin: (token) => {
    setToken(token);
    set({ status: 'signIn', token });
    deinitializeSocket();
    initializeSocket();
  },
  signout: () => {
    signOut(auth);
    removeToken();
    set({ status: 'signOut', token: null });
    deinitializeSocket();
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      if (userToken !== null) {
        get().signin(userToken);
      } else {
        get().signout();
      }

      const onboardingToken = getOnboardingToken();
      if (onboardingToken !== null) {
        get().setOnboarding(true);
      } else {
        get().setOnboarding(false);
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
  setOnboarding: (bool) => {
    set({ onboardingStatus: bool });
    if (bool) {
      setOnboardingToken({
        access: 'onboarding-access-token',
        refresh: 'onboarding-refresh-token',
      });
    } else {
      removeOnboardingToken();
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signout = () => _useAuth.getState().signout();
export const signin = (token: TokenType) => _useAuth.getState().signin(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const setOnboarding = (bool: boolean) =>
  _useAuth.getState().setOnboarding(bool);
