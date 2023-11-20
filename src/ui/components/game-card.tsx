import { Card } from '@rneui/base';
import { Badge } from '@rneui/themed';
import React from 'react';

import { Image, Pressable, Text, View } from '@/ui';

import images from '../core/images';

export interface GameProps {
  type?: string;
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
}

export const GameCard = ({
  type,
  title,
  description,
  tags = [],
  image,
  backgroundColor = 'papayawhip',
  textColor = 'black',
  onPress = () => {
    console.log('Default card press (unassigned)');
  },
}: GameProps) => {
  return (
    <Pressable onPress={onPress} disabled={type === 'steps'}>
      <Card
        containerStyle={{
          backgroundColor: type === 'steps' ? 'darkgray' : backgroundColor,
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
          <View className="ml-[-20] flex">
            {image && (
              <Image
                source={images[image as keyof typeof images]}
                style={{
                  width: 100,
                  height: 120,
                  resizeMode: 'contain',
                }}
              />
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
