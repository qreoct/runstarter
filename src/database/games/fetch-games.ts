import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/database/firebase-config';

import { gameConverter } from './games-converter';
import type { Game } from './types';

export const fetchGameWithId = async (id: string) => {
  const gameRef = doc(db, 'games', id).withConverter(gameConverter);
  const docSnap = await getDoc(gameRef);
  const game = docSnap.data() as Game;
  game.id = id;
  return game; 
};
