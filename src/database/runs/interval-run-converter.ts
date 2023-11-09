import type { IntervalRun } from './types';

// Firestore data converter
export const intervalRunConverter = {
  toFirestore: (intervalRun: IntervalRun) => ({
    id: intervalRun.id,
    game: intervalRun.gameId,
    createdAt: intervalRun.createdAt,
    intervals: intervalRun.intervals,
  }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      id: data.id,
      gameId: data.game,
      createdAt: data.createdAt,
      intervals: data.intervals,
    };
  },
};
