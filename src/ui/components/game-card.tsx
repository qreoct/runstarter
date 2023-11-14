import { Card } from '@rneui/base';
import { Badge } from '@rneui/themed';
import React from 'react';
import type { ImageProps } from 'react-native';

import { Image, Pressable, Text, View } from '@/ui';

export interface GameProps {
  type?: string;
  title: string;
  description: string;
  tags?: string[];
  image?: ImageProps;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
}

export const GameCard = ({
  title,
  description,
  tags,
  image,
  backgroundColor = 'papayawhip',
  textColor = 'black',
  onPress = () => {
    console.log('Default card press (unassigned)');
  },
}: GameProps) => {
  return (
    <Pressable onPress={onPress}>
      <Card
        containerStyle={{
          backgroundColor: backgroundColor,
          borderRadius: 8,
          flex: 1,
          height: '100%',
        }}
      >
        <View className="flex flex-row p-4 pb-2">
          <View className="flex">
            <Text className="text-lg font-bold" style={{ color: textColor }}>
              {title}
            </Text>
            <Text
              className="max-w-[90%] text-gray-800"
              style={{ color: textColor }}
            >
              {description}
            </Text>
            {tags && (
              <View className="flex flex-row items-center ">
                {tags.map((tag, index) => (
                  <Badge
                    key={`${index}-tag`}
                    value={` ${tag} `}
                    badgeStyle={{
                      backgroundColor: 'black',
                      margin: 8,
                      marginStart: 0,
                    }}
                  />
                ))}
              </View>
            )}
          </View>
          <View className="flex">
            {image && (
              <Image
                source={image}
                style={{
                  width: 100,
                  height: 120,
                  resizeMode: 'center',
                }}
              />
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
