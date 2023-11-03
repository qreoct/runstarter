import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

import { db } from '../firebase-config';
import type { User } from './types';

// Send a friend request
export const sendFriendRequest = async (
  senderId: string,
  receiver: User
): Promise<void> => {
  // Add senderId to the receiver's friendRequests list and vice versa
  const senderRef = doc(db, 'users', senderId);
  const receiverRef = doc(db, 'users', receiver.id);

  await updateDoc(senderRef, {
    'friendRequests.pending': arrayUnion(receiver.id),
  });
  await updateDoc(receiverRef, {
    'friendRequests.received': arrayUnion(senderId),
  });
};

// Accept a friend request
export const acceptFriendRequest = async (
  senderId: string,
  receiverId: string
): Promise<void> => {
  // Add senderId to the receiver's friends list and vice versa
  const senderRef = doc(db, 'users', senderId);
  const receiverRef = doc(db, 'users', receiverId);

  await updateDoc(senderRef, {
    friends: arrayUnion(receiverId),
    'friendRequests.pending': arrayRemove(receiverId),
  });
  await updateDoc(receiverRef, {
    friends: arrayUnion(senderId),
    'friendRequests.received': arrayRemove(senderId),
  });
};

// Reject a friend request
export const rejectFriendRequest = async (
  senderId: string,
  receiverId: string
): Promise<void> => {
  // Remove senderId from the receiver's friendRequests list and vice versa
  const senderRef = doc(db, 'users', senderId);
  const receiverRef = doc(db, 'users', receiverId);

  await updateDoc(senderRef, {
    'friendRequests.pending': arrayRemove(receiverId),
  });
  await updateDoc(receiverRef, {
    'friendRequests.received': arrayRemove(senderId),
  });
};
