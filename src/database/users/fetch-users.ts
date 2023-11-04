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

import type { User } from './types';
import { userConverter } from './users-converter';

export const fetchUsers = async (name = '') => {
  const usersRef = collection(db, 'users').withConverter(userConverter);

  const queryConstraints = [
    where('name', '>=', name),
    where('name', '<=', name + '\uf8ff'),
  ];

  const q = query(usersRef, ...queryConstraints);

  let res: User[] = [];
  await getDocs(q).then((querySnapshots) => {
    querySnapshots.forEach((snapshot) => {
      res.push({ id: snapshot.id, ...snapshot.data() });
    });
  });
  return res;
};

export const fetchUserWithId = async (id: string) => {
  const userRef = doc(db, 'users', id).withConverter(userConverter);
  const docSnap = await getDoc(userRef);
  return docSnap.data() as User;
};

export const fetchUsersWithIds = async (ids: string[]) => {
  const promises: Promise<DocumentSnapshot>[] = [];

  if (ids.length === 0) return [];

  ids.forEach((id) =>
    promises.push(getDoc(doc(db, 'users', id).withConverter(userConverter)))
  );

  const users = await Promise.all(promises).then((docSnaps) =>
    docSnaps.map((docSnap) => {
      return { id: docSnap.id, ...docSnap.data() } as User;
    })
  );
  return users;
};
