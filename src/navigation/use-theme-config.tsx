import type { Theme } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';

import { colors } from '@/ui/theme';

// const DarkTheme: Theme = {
//   ..._DarkTheme,
//   colors: {
//     ..._DarkTheme.colors,
//     primary: colors.primary[200],
//     background: colors.charcoal[950],
//     text: colors.charcoal[100],
//     border: colors.charcoal[500],
//     card: colors.charcoal[850],
//   },
// };

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[400],
    background: colors.white,
  },
};

export function useThemeConfig() {
  return LightTheme;
}
