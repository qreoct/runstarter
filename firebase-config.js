// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXmnTWA0jxjkokDNV2nrRup-5ZMpjEenM",
  authDomain: "vaulted-gift-401815.firebaseapp.com",
  projectId: "vaulted-gift-401815",
  storageBucket: "vaulted-gift-401815.appspot.com",
  messagingSenderId: "923831664425",
  appId: "1:923831664425:web:756a4524c8904f70988138",
  measurementId: "G-B7LVHBMMC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);

// Client IDs
// iOS: 923831664425-9crg238fbqfe2g5ktgdoeg6ao9ktisan.apps.googleusercontent.com
// Android: 923831664425-qjmcljl658jb59hed6eopg4hc5vbn08t.apps.googleusercontent.com
