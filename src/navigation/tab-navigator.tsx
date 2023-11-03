import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColorScheme } from 'nativewind';
import type { ComponentType } from 'react';
import * as React from 'react';
import type { SvgProps } from 'react-native-svg';

import { Friends, NewRun } from '@/screens';
import {
  colors,
  Controller as ControllerIcon,
  Profile as ProfileIcon,
  Runner as RunnerIcon,
} from '@/ui';

import { ProfileNavigator } from './profile-navigator';

type TabParamList = {
  Friends: undefined;
  // Run: undefined;
  ProfileNavigator: undefined;
  NewRun: undefined;
  // Settings: undefined;
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
  Friends: (props: SvgProps) => <RunnerIcon {...props} />,
  // Run: (props: SvgProps) => <StyleIcon {...props} />,
  ProfileNavigator: (props: SvgProps) => <ProfileIcon {...props} />,
  NewRun: (props: SvgProps) => <ControllerIcon {...props} />,
  // Settings: (props: SvgProps) => <SettingsIcon {...props} />,
};

export type TabList<T extends keyof TabParamList> = {
  navigation: NativeStackNavigationProp<TabParamList, T>;
  route: RouteProp<TabParamList, T>;
};

const tabs: TabType[] = [
  {
    name: 'Friends',
    component: Friends,
    label: 'Friends',
  },
  // {
  //   name: 'Run',
  //   component: Run,
  //   label: 'Run',
  // },
  {
    name: 'NewRun',
    component: NewRun,
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
  const { colorScheme } = useColorScheme();
  return (
    <Tab.Navigator
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
            />
          );
        })}
      </Tab.Group>
    </Tab.Navigator>
  );
};
