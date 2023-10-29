import { signOut } from 'firebase/auth';
import { auth } from '@/database/firebase-config';
import { create } from 'zustand';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  onboardingStatus: boolean;
  signin: (data: TokenType) => void;
  signout: () => void;
  hydrate: () => void;
  setOnboarding: (bool: boolean) => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  onboardingStatus: false,
  signin: (token) => {
    setToken(token);
    set({ status: 'signIn', token });
  },
  signout: () => {
    signOut(auth);
    removeToken();
    set({ status: 'signOut', token: null });
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      if (userToken !== null) {
        get().signin(userToken);
      } else {
        get().signout();
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
  setOnboarding: (bool) => {
    set({ onboardingStatus: bool });
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signout = () => _useAuth.getState().signout();
export const signin = (token: TokenType) => _useAuth.getState().signin(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const setOnboarding = (bool: boolean) =>
  _useAuth.getState().setOnboarding(bool);
