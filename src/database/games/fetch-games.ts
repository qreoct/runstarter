import type { DocumentSnapshot } from 'firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/database/firebase-config';

import type { Game } from './types';
import { gameConverter } from './games-converter';

export const fetchGameWithId = async (id: string) => {
  const userRef = doc(db, 'games', id).withConverter(gameConverter);
  const docSnap = await getDoc(userRef);
  return docSnap.data() as Game;
};
