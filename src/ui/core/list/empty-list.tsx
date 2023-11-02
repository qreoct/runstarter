import React from 'react';
import { ActivityIndicator } from 'react-native';

import { NoData } from '../../icons';
import { Text } from '../text';
import { View } from '../view';
type Props = {
  isLoading: boolean;
  message?: string;
  image?: JSX.Element;
};
export const EmptyList = React.memo(
  ({ isLoading, image = <NoData />, message = 'No data found.' }: Props) => {
    return (
      <View className="min-h-[400px] flex-1 items-center justify-center">
        {!isLoading ? (
          <View>
            {image}
            <Text className="pt-4 text-center">{message}</Text>
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }
);
