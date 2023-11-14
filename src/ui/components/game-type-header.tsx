import React from 'react';

import gamesData from '@/data/games.json';
import { Image, Text, View } from '@/ui';

import images from '../core/images';

// import type { GameProps } from './game-card';
export const games = {
  duckduckrun: {
    data: gamesData.duckduckrun,
  },
  steps: {
    data: gamesData.steps,
  },
  comingsoon: {
    data: gamesData.comingsoon,
  },
};

export type Games = keyof typeof games;

export const GameTypeHeader = ({ gameType }: { gameType?: Games }) => {
  return (
    gameType && (
      <View className="flex flex-row p-6 pb-2">
        <View className="flex">
          <Text className="text-xl font-bold text-gray-900">
            {games[gameType].data.title}
          </Text>
          {/* <Text className="text-blue-500">How to play?</Text> */}
          <Image
            source={
              images[games[gameType].data.previewImage as keyof typeof images]
            }
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'contain',
            }}
          />
          <Text className="text-gray-800">
            {games[gameType].data.description}
          </Text>
        </View>
      </View>
    )
  );
};
