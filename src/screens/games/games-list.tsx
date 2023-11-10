import React from 'react';

import { GameCard } from '@/ui/components/game-card';

const games = [
  {
    title: 'Duck Duck Run!',
    description:
      'Run intervals with a buddy while a wave of ducks chase you down.',
    tags: ['10 Min', '15 Min'],
    image: 'assets/images/Goose.png',
    color: 'papayawhip',
  },
  {
    title: 'Fartleks with Kittens!',
    description:
      'Run a fartlek with a buddy while a wave of kittens tries to adopt you their parent!',
    tags: ['10 Min', '15 Min'],
    image: 'assets/images/Cat.png',
    color: 'papayawhip',
  },
  {
    title: '[Limited Time] STePS Contest',
    description:
      'Win $100 worth of prizes! Check out our booth @ COM02-01 to find out more!',
    // image: 'assets/images/Cat.png',
    color: 'papayawhip',
  },
  {
    title: 'More Games Coming Soon',
    description: 'Stay tuned for more games!',
  },
];

export const GamesList = () => {
  return (
    <>
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
    </>
  );
};
