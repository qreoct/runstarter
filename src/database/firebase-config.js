// Import the functions you need from the SDKs you need
import { Env } from '@env';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Env.REACT_APP_FIREBASE_API_KEY,
  authDomain: Env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: Env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: Env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: Env.REACT_APP_FIREBASE_APP_ID,
  measurementId: Env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

// Client IDs
export const IOS_CLIENT_ID = Env.REACT_APP_IOS_CLIENT_ID;
export const ANDROID_CLIENT_ID = Env.REACT_APP_ANDROID_CLIENT_ID;
