import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';

import { FocusAwareStatusBar, ScrollView } from '@/ui';
import { GameCard } from '@/ui/components/game-card';
import type { Games } from '@/ui/components/game-type-header';
import { games } from '@/ui/components/game-type-header';

// const images = {
//   goose: require('assets/images/Goose.png'),
//   cat: require('assets/images/Cat.png'),
//   dazzy: require('assets/images/Dazzy.png'),
// };

// const games = [
//   {
//     type: 'duckduckrun',
//     title: 'Duck Duck Run!',
//     description:
//       'Run intervals with a buddy while a wave of ducks chase you down.',
//     tags: ['10 Min', '15 Min'],
//     image: images.goose,
//     backgroundColor: '#FFF9E4',
//   },
//   {
//     type: 'fartlekwithkittens',
//     title: 'Fartleks with Kittens!',
//     description:
//       'Run a fartlek with a buddy while a wave of kittens tries to adopt you their parent!',
//     tags: ['10 Min', '15 Min'],
//     image: images.cat,
//     backgroundColor: '#F2E4FF',
//   },
//   {
//     type: 'steps25contest',
//     title: '[Limited Time] STePS Contest',
//     description:
//       'Win $100 worth of prizes! Check out our booth @ COM1 SR1 3216-06 to find out more!',
//     image: images.dazzy,
//     backgroundColor: '#FFDC9A',
//   },
//   {
//     title: 'More Games Coming Soon',
//     description: 'Stay tuned for more games!',
//     backgroundColor: 'black',
//     textColor: 'white',
//   },
// ];

export const GamesList = () => {
  const navigation = useNavigation();
  const handleCardPress = useCallback(
    (game: Games) => {
      if (games[game as keyof typeof games].data.type !== '') {
        navigation.dispatch(
          StackActions.push('NewGame', {
            gameType: games[game as keyof typeof games].data.type,
          })
        );
      }
    },
    [navigation]
  );

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        {Object.keys(games).map((game, idx) => (
          <GameCard
            key={idx}
            title={games[game as keyof typeof games].data.title}
            description={games[game as keyof typeof games].data.description}
            tags={games[game as keyof typeof games].data.tags}
            image={games[game as keyof typeof games].data.thumbnailImage}
            backgroundColor={
              games[game as keyof typeof games].data.backgroundColor
            }
            textColor={games[game as keyof typeof games].data.textColor}
            onPress={() => handleCardPress(game as keyof typeof games)}
          />
        ))}
      </ScrollView>
    </>
  );
};
