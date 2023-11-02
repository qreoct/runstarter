import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/database/firebase-config';

import type { User } from './types';
import { userConverter } from './users-converter';

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
    res.push({ id: doc.id, ...doc.data() });
  });
  return res;
};
