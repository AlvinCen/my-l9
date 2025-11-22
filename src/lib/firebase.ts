import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, setLogLevel } from 'firebase/firestore';

// --- HARDCODE CONFIGURATION HERE FOR DEBUGGING ---
// Copy this object directly from Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLVJfpc6_gADbuzFYoPbuL9u0C4nBouXo",
  authDomain: "l9-companion.firebaseapp.com",
  projectId: "l9-companion",
  storageBucket: "l9-companion.firebasestorage.app",
  messagingSenderId: "18530209756",
  appId: "1:18530209756:web:7680483b7055ac39af0919"
};

/*
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || '').trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '').trim(),
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '').trim()
};
*/

console.log("Firebase Config Loading:", {
  apiKey: firebaseConfig.apiKey ? "Present" : "MISSING",
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Enable verbose logging for Firestore
setLogLevel('debug');

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
