// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9nQGrFkTX6JOG1iaHlgKOuym8iswzPtA",
  authDomain: "nego-pos.firebaseapp.com",
  projectId: "nego-pos",
  storageBucket: "nego-pos.firebasestorage.app",
  messagingSenderId: "356619460833",
  appId: "1:356619460833:web:cd26ad49958a3896b497a0",
  measurementId: "G-HQ6FR9N5ZB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
