import React from 'react';

import { Text, View } from '../core';

interface ValueProps {
  label: string;
  value: number;
  unit?: string;
}

export const Value = ({ label, value, unit }: ValueProps) => {
  return (
    <View className="flex items-start">
      <Text>{label}</Text>
      <View className="flex-row items-baseline">
        <Text variant="h1">{value.toFixed(2)}</Text>
        {unit ? <Text variant="h1"> {unit}</Text> : null}
      </View>
    </View>
  );
};
