import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../firebase-config';
import type { User } from '.';
import { userConverter } from './users-converter';

export async function fetchCurrentUser() {
  if (auth.currentUser == null) {
    return null;
  }
  const userRef = doc(db, 'users', auth.currentUser.uid).withConverter(
    userConverter
  );
  const docSnap = await getDoc(userRef);
  return docSnap.data() as User;
}
