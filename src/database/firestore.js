import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/database/firebase-config';

import { generateProfilePicture } from './utils';

/**
 * @param {any} user
 */
export async function addUserIfNotExist(user) {
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) {
    if (user.photoURL === null) {
      user.photoURL = generateProfilePicture(user.uid);
    }
    await setDoc(userRef, {
      hasCompletedOnboarding: false,
      photoURL: user.photoURL,
      currentGame: null,
      invitedGames: [],
    });
  }
}

/** Updates name, age and gender of user
 * @param {string} uid
 * @param {{ name: string; age: string; gender: string; }} data
 */
export async function updateUserParticulars(uid, data) {
  const userRef = doc(db, 'users', uid);
  await setDoc(
    userRef,
    {
      name: data.name,
      age: Number(data.age),
      gender: data.gender,
    },
    { merge: true }
  );
}

/**
 * @param {string} uid
 * @param {string} habit
 * @param {number} goal
 */
export async function updateUserPreferences(uid, habit, goal) {
  const userRef = doc(db, 'users', uid);
  await setDoc(
    userRef,
    {
      runningHabit: habit,
      runningGoal: goal,
    },
    { merge: true }
  );
}

/**
 * @param {string} uid
 */
export async function getUserOnboarding(uid) {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) {
    console.log('User does not exist');
    return;
  }
  return docSnap.data().hasCompletedOnboarding;
}

/**
 * @param {string} uid
 */
export async function finishUserOnboarding(uid) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    hasCompletedOnboarding: true,
    friendRequests: {
      received: [],
      sent: [],
    },
    friends: [],
  });
}

/**
 * @param {string} uid
 * @param {string} runId
 * @param {string} gameId
 */
export async function linkRunToGame(uid, runId, gameId) {
  const runRef = doc(db, 'users', uid, 'runs', runId);
  const gameRef = doc(db, 'games', gameId);
  updateDoc(runRef, {
    game: gameId,
  });
  setDoc(gameRef, { runs: { [uid]: runId } }, { merge: true });
}
