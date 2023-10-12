import { useIsFocused } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, StatusBar } from 'react-native';

type Props = React.ComponentProps<typeof StatusBar>;
export const FocusAwareStatusBar = (props: Props) => {
  const isFocused = useIsFocused();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const barStyle = isDark ? 'light-content' : 'dark-content';

  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
  }

  return isFocused ? <StatusBar barStyle={barStyle} {...props} /> : null;
};
