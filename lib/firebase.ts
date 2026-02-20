import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD_rNJjKorAUF0pjcGg7M65fndBUdaI2Y",
  authDomain: "srour-cars-rental.firebaseapp.com",
  projectId: "srour-cars-rental",
  storageBucket: "srour-cars-rental.firebasestorage.app",
  messagingSenderId: "412387741709",
  appId: "1:412387741709:web:ea194e356f5d96245a0544"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
