import { Card } from '@rneui/base';
import React from 'react';
import { Image, View } from 'react-native';

import { Text } from '../core';

export interface GameProps {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  color?: string;
  onPress: () => void;
}

export const GameCard = ({
  title,
  description,
  tags,
  image,
  color = 'papayawhip',
}: GameProps) => {
  return (
    <Card containerStyle={{ backgroundColor: color }}>
      <View>
        {image && (
          <Image
            source={{
              uri: image,
            }}
          />
        )}
      </View>
      <View>
        <Text>{title}</Text>
        <Text>{description}</Text>
        {tags && (
          <View className="flex flex-row">
            {tags.map((tag) => (
              <Text>{tag}</Text>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
};
