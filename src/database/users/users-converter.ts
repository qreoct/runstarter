import { generateProfilePicture } from '../utils';
import type { User } from './types';

// Firestore data converter
export const userConverter = {
  toFirestore: (user: User) => ({
    id: user.id,
    name: user.name,
    age: user.age,
    photoURL: user.photoURL,
    gender: user.gender,
    runningGoal: user.runningGoal,
    runningHabit: user.runningHabit,
    friends: user.friends,
    friendRequests: user.friendRequests,
    invitedGames: user.invitedGames,
  }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      name: data.name,
      age: data.age,
      gender: data.gender,
      photoURL: data.photoURL || generateProfilePicture(data.name),
      runningGoal: data.runningGoal,
      runningHabit: data.runningHabit,
      friends: data.friends,
      friendRequests: data.friendRequests,
      invitedGames: data.invitedGames,
    };
  },
};
