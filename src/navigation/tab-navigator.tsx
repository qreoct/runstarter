import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge, Icon as IconComponent } from '@rneui/base';
import { doc, onSnapshot } from 'firebase/firestore';
import { useColorScheme } from 'nativewind';
import type { ComponentType } from 'react';
import * as React from 'react';
import type { SvgProps } from 'react-native-svg';

import { useAuth } from '@/core/auth';
import { db } from '@/database';
import { auth } from '@/database/firebase-config';
import { userConverter } from '@/database/users/users-converter';
import {
  colors,
  Profile as ProfileIcon,
  Runner as RunnerIcon,
  View,
} from '@/ui';

import { FriendsNavigator } from './friends-navigator';
import { GamesNavigator } from './games-navigator';
import { ProfileNavigator } from './profile-navigator';

type TabParamList = {
  Friends: undefined;
  ProfileNavigator: undefined;
  GamesNavigator: undefined;
};

type TabType = {
  name: keyof TabParamList;
  component: ComponentType<any>;
  label: string;
};

type TabIconsType = {
  [key in keyof TabParamList]: (props: SvgProps) => JSX.Element;
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabsIcons: TabIconsType = {
  Friends: (props: SvgProps) => {
    const requests = useAuth().currentUser?.friendRequests?.pending || [];
    return (
      <View>
        <RunnerIcon {...props} />
        {requests.length > 0 && (
          <Badge
            status="primary"
            value={requests.length}
            containerStyle={{ position: 'absolute', top: 0, left: 20 }}
          />
        )}
      </View>
    );
  },
  GamesNavigator: (props: SvgProps) => {
    const invitedGames = useAuth().currentUser?.invitedGames || [];
    return (
      <View>
        <IconComponent
          name="game-controller"
          type="ionicon"
          color={props.color}
        />
        {invitedGames.length > 0 && (
          <Badge
            status="primary"
            value={invitedGames.length}
            containerStyle={{ position: 'absolute', top: 0, left: 20 }}
          />
        )}
      </View>
    );
  },
  ProfileNavigator: (props: SvgProps) => <ProfileIcon {...props} />,
};

// from https://stackoverflow.com/a/67895977
const resetStacksOnTabClicks = ({ navigation }: any) => ({
  tabPress: (e: any) => {
    const state = navigation.getState();
    if (state) {
      const nonTargetTabs = state.routes.filter((r: any) => r.key !== e.target);
      nonTargetTabs.forEach((tab: any) => {
        if (tab?.state?.key) {
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: tab?.state?.key,
          });
        }
      });
    }
  },
});

export type TabList<T extends keyof TabParamList> = {
  navigation: NativeStackNavigationProp<TabParamList, T>;
  route: RouteProp<TabParamList, T>;
};

const tabs: TabType[] = [
  {
    name: 'Friends',
    component: FriendsNavigator,
    label: 'Friends',
  },
  {
    name: 'GamesNavigator',
    component: GamesNavigator,
    label: 'Games',
  },
  {
    name: 'ProfileNavigator',
    component: ProfileNavigator,
    label: 'Profile',
  },
];

type BarIconType = {
  name: keyof TabParamList;
  color: string;
};

const BarIcon = ({ color, name, ...reset }: BarIconType) => {
  const Icon = tabsIcons[name];
  return <Icon color={color} {...reset} />;
};

export const TabNavigator = () => {
  /* query and set store for user, this affects all screens */
  const setCurrentUser = useAuth((state) => state.setCurrentUser);
  const currentUserId = auth.currentUser?.uid;

  React.useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const userRef = doc(db, 'users', currentUserId).withConverter(
      userConverter
    );
    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setCurrentUser({
          ...data,
          id: currentUserId,
        });
      }
    });

    // cleanup & unsubscribe
    return () => {
      setCurrentUser(undefined);
      unsubscribe();
    };
  }, [setCurrentUser, currentUserId]);

  const { colorScheme } = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName="GamesNavigator"
      screenOptions={({ route }) => ({
        tabBarInactiveTintColor:
          colorScheme === 'dark' ? colors.charcoal[400] : colors.neutral[400],
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => <BarIcon name={route.name} color={color} />,
      })}
    >
      <Tab.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        {tabs.map(({ name, component, label }) => {
          return (
            <Tab.Screen
              key={name}
              name={name}
              component={component}
              options={{
                title: label,
                tabBarTestID: `${name}-tab`,
              }}
              listeners={resetStacksOnTabClicks}
            />
          );
        })}
      </Tab.Group>
    </Tab.Navigator>
  );
};
