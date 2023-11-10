import React from 'react';

import { FocusAwareStatusBar, ScrollView } from '@/ui';
import { GameCard } from '@/ui/components/game-card';

const images = {
  goose: require('assets/images/Goose.png'),
  cat: require('assets/images/Cat.png'),
};

const games = [
  {
    title: 'Duck Duck Run!',
    description:
      'Run intervals with a buddy while a wave of ducks chase you down.',
    tags: ['10 Min', '15 Min'],
    image: images.goose,
    color: 'papayawhip',
  },
  {
    title: 'Fartleks with Kittens!',
    description:
      'Run a fartlek with a buddy while a wave of kittens tries to adopt you their parent!',
    tags: ['10 Min', '15 Min'],
    image: images.cat,
    color: 'papayawhip',
  },
  {
    title: '[Limited Time] STePS Contest',
    description:
      'Win $100 worth of prizes! Check out our booth @ COM1 SR1 3216-06 to find out more!',
    color: 'papayawhip',
  },
  {
    title: 'More Games Coming Soon',
    description: 'Stay tuned for more games!',
  },
  {
    title: 'More Games Coming Soon',
    description: 'Stay tuned for more games!',
  },
  {
    title: 'More Games Coming Soon',
    description: 'Stay tuned for more games!',
  },
];

export const GamesList = () => {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        {games.map((game, idx) => (
          <GameCard
            key={idx}
            title={game.title}
            description={game.description}
            tags={game.tags}
            image={game.image}
            color={game.color}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </>
  );
};
