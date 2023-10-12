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
        <Text variant="h2">{value}</Text>
        {unit ? <Text variant="xs">{unit.toUpperCase()}</Text> : null}
      </View>
    </View>
  );
};
