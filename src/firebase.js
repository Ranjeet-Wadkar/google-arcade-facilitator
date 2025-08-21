// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2g3AUA3mKHFDdbPb4S9xZYX7cjVGwC6U",
  authDomain: "ranjeet-arcade.firebaseapp.com",
  projectId: "ranjeet-arcade",
  storageBucket: "ranjeet-arcade.firebasestorage.app",
  messagingSenderId: "49909520238",
  appId: "1:49909520238:web:b4cc429edb515a6edcd37f",
  measurementId: "G-JE8YHB2KKL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Helper login/logout functions
export const login = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
