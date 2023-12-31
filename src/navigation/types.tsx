import type { RouteProp as NRouteProp } from '@react-navigation/native';

import type { AuthStackParamList } from './auth-navigator';
import type { FeedStackParamList } from './feed-navigator';
import type { FriendsStackParamList } from './friends-navigator';
import type { GamesStackParamList } from './games-navigator';
import type { OnboardingStackParamList } from './onboarding-navigator';
import type { ProfileStackParamList } from './profile-navigator';

export type RootStackParamList = AuthStackParamList &
  FeedStackParamList &
  ProfileStackParamList &
  OnboardingStackParamList &
  FriendsStackParamList &
  GamesStackParamList;
// very important to type check useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RouteProp<T extends keyof RootStackParamList> = NRouteProp<
  RootStackParamList,
  T
>;
