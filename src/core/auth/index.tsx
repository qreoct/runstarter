import { create } from 'zustand';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';
import { signOut } from 'firebase/auth';
import { auth } from 'firebase-config';

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signin: (data: TokenType) => void;
  signout: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
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
}));

export const useAuth = createSelectors(_useAuth);

export const signout = () => _useAuth.getState().signout();
export const signin = (token: TokenType) => _useAuth.getState().signin(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
