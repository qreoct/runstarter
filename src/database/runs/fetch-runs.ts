import { collection, getDocs } from 'firebase/firestore';

import { db } from '../firebase-config';
import { intervalRunConverter } from './interval-run-converter';
import type { IntervalRun } from './types';

export const fetchRunsForUser = async (userId: string) => {
  if (userId === '') return [];

  let runData: IntervalRun[] = [];

  const collectionRef = collection(db, 'users', userId, 'runs').withConverter(
    intervalRunConverter
  );

  await getDocs(collectionRef).then((runs) => {
    runs.docs.forEach((runSnapshot) => {
      runData.push({
        ...runSnapshot.data(),
        id: runSnapshot.id,
      } as IntervalRun);
    });
  });

  // Sort runs by datetime (most recent first)
  runData.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  return runData;
};
