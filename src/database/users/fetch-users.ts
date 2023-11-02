import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/database/firebase-config';

import type { User } from './types';

// Firestore data converter
const userConverter = {
  toFirestore: (user: User) => ({
    name: user.name,
    age: user.age,
    gender: user.gender,
    runningGoal: user.runningGoal,
    runningHabit: user.runningHabit,
  }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      name: data.name,
      age: data.age,
      gender: data.gender,
      runningGoal: data.runningGoal,
      runningHabit: data.runningHabit,
    };
  },
};

export const fetchUsers = async (name = '') => {
  const usersRef = collection(db, 'users').withConverter(userConverter);
  const q = query(
    usersRef,
    where('name', '>=', name),
    where('name', '<=', name + '\uf8ff')
  );
  const docSnap = await getDocs(q);

  let res: User[] = [];
  docSnap.forEach((doc) => {
    res.push(doc.data());
  });
  return res;
};
