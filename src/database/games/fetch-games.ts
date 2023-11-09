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

export const fetchGameLeaderboard = async (id: string) => {
  console.log("gameId:", id);
  const gameRef = doc(db, 'games', id);
  const docSnap = await getDoc(gameRef);
  console.log("doc:", docSnap.data());
  // Wait for game to be active
  if (docSnap.data()?.active) return;

  const gameRuns = docSnap.data()?.runs;
  console.log("gameRuns:", gameRuns);

  let leaderBoard = [];
  // Each entry in leaderBoard:
  // {
  //   profilePic: string;
  //   name: string;
  //   distance: number;
  //   time: number;
  //   avgPace: string;
  //   rank: number;
  // }

  // gameRuns is a map of uid: runId
  for (const uid in gameRuns) {
    let leaderBoardEntry: { 
      profilePic: string,
      name: string,
      distance: number,
      time: number,
      avgPace: string,
      rank: number,
     } = { profilePic: '',
          name: '',
          distance: 0,
          time: 0,
          avgPace: '',
          rank: 0,
         };
    const runId = gameRuns[uid];
    const runRef = doc(db, 'users', uid, 'runs', runId);
    const runDocSnap = await getDoc(runRef);
    const run = runDocSnap.data();
    console.log("run:", run);

    const userRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userRef);
    const user = userDocSnap.data();
    console.log("user:", user);

    if (user) {
      leaderBoardEntry['profilePic'] = user.photoURL;
      leaderBoardEntry['name'] = user.name;
      console.log("updated user");
    }
    if (run) {
      let distance = 0;
      let time = 0;
      for (const interval of run.intervals) {
        distance += interval.distanceMeters;
        time += interval.durationMs;
      }
      leaderBoardEntry['distance'] = distance;
      leaderBoardEntry['time'] = time;
      console.log("updated run");
    }

    leaderBoard.push(leaderBoardEntry);
  }
  // Sort leaderboard by distance
  leaderBoard.sort((a, b) => b.distance - a.distance);
  // Add rank to each entry
  for (let i = 0; i < leaderBoard.length; i++) {
    leaderBoard[i].rank = i + 1;
  }
  return leaderBoard;
}
