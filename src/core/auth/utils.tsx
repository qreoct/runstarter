import { getItem, removeItem, setItem } from '@/core/storage';

const TOKEN = 'token';
const ONBOARDING_TOKEN = 'onboarding';

export type TokenType = {
  access: string;
  refresh: string;
  id: string;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);

export const getOnboardingToken = () => getItem<TokenType>(ONBOARDING_TOKEN);
export const removeOnboardingToken = () => removeItem(ONBOARDING_TOKEN);
export const setOnboardingToken = (value: TokenType) =>
  setItem<TokenType>(ONBOARDING_TOKEN, value);
