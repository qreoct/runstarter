import React from 'react';

import { FocusAwareStatusBar, ScrollView, Text, View } from '@/ui';

export const Friends = () => {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="flex-1 px-4 pt-10">
          <Text> Search for more friends </Text>
          <Text> View your friends histories </Text>
        </View>
      </ScrollView>
    </>
  );
};
