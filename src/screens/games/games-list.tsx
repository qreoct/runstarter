import React from 'react';

import { FocusAwareStatusBar, ScrollView } from '@/ui';
import { GameCard } from '@/ui/components/game-card';

const images = {
  goose: require('assets/images/Goose.png'),
  cat: require('assets/images/Cat.png'),
  dazzy: require('assets/images/Dazzy.png'),
};

const games = [
  {
    title: 'Duck Duck Run!',
    description:
      'Run intervals with a buddy while a wave of ducks chase you down.',
    tags: ['10 Min', '15 Min'],
    image: images.goose,
    backgroundColor: '#FFF9E4',
  },
  {
    title: 'Fartleks with Kittens!',
    description:
      'Run a fartlek with a buddy while a wave of kittens tries to adopt you their parent!',
    tags: ['10 Min', '15 Min'],
    image: images.cat,
    backgroundColor: '#F2E4FF',
  },
  {
    title: '[Limited Time] STePS Contest',
    description:
      'Win $100 worth of prizes! Check out our booth @ COM1 SR1 3216-06 to find out more!',
    image: images.dazzy,
    backgroundColor: '#FFDC9A',
  },
  {
    title: 'More Games Coming Soon',
    description: 'Stay tuned for more games!',
    backgroundColor: 'black',
    textColor: 'white',
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
            backgroundColor={game.backgroundColor}
            textColor={game.textColor}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </>
  );
};
