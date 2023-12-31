import { signOut } from 'firebase/auth';
import { deinitializeSocket, initializeSocket } from 'server/server-utils';
import { create } from 'zustand';

import type { User } from '@/api';
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
  currentUser: User | undefined;
  userId: string;
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  onboardingStatus: boolean;
  onboardingToken: TokenType | null;
  signin: (data: TokenType) => void;
  signout: () => void;
  hydrate: () => void;
  setOnboarding: (bool: boolean) => void;
  setCurrentUser: (user: User | undefined) => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  currentUser: undefined,
  status: 'idle',
  token: null,
  userId: '',
  onboardingStatus: false,
  onboardingToken: null,
  signin: (token) => {
    setToken(token);
    set({ status: 'signIn', token, userId: token.id });
    deinitializeSocket();
    initializeSocket();
  },
  signout: () => {
    signOut(auth);
    removeToken();
    set({ status: 'signOut', token: null, userId: '' });
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
        id: 'onboarding-id',
      });
    } else {
      removeOnboardingToken();
    }
  },
  setCurrentUser: (user: User | undefined) => {
    set((state) => ({ ...state, currentUser: user }));
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signout = () => _useAuth.getState().signout();
export const signin = (token: TokenType) => _useAuth.getState().signin(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const setOnboarding = (bool: boolean) =>
  _useAuth.getState().setOnboarding(bool);
export const setCurrentUser = (user: User | undefined) =>
  _useAuth.getState().setCurrentUser(user);
