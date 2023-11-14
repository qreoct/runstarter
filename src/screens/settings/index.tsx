import { Env } from '@env';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Linking } from 'react-native';

import { useAuth } from '@/core';
import { FocusAwareStatusBar, ScrollView, View } from '@/ui';
import { Instagram, Rate, Website } from '@/ui/icons';
import colors from '@/ui/theme/colors';

import { Item } from './item';
import { ItemsContainer } from './items-container';

export const Settings = () => {
  const signOut = useAuth.use.signout();
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err)
    );
  };
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4">
          <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
          </ItemsContainer>

          <ItemsContainer title="settings.support_us">
            {/* <Item
              text="settings.share"
              icon={<Share color={iconColor} />}
              onPress={() => {}}
            /> */}
            <Item
              text="settings.rate"
              icon={<Rate color={iconColor} />}
              onPress={() => {
                openURL(
                  'https://play.google.com/store/apps/details?id=com.runstarter.development'
                );
              }}
            />
          </ItemsContainer>

          <ItemsContainer title="settings.links">
            <Item
              text="settings.instagram"
              icon={<Instagram color={iconColor} />}
              onPress={() => {
                openURL('https://instagram.com/runsquadv');
              }}
            />
            <Item
              text="settings.website"
              icon={<Website color={iconColor} />}
              onPress={() => {
                openURL('https://run-squad-landing.vercel.app');
              }}
            />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
