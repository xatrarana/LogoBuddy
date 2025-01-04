// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain: "logobuddy-7dfdd.firebaseapp.com",

  projectId: "logobuddy-7dfdd",

  storageBucket: "logobuddy-7dfdd.firebasestorage.app",

  messagingSenderId: "736735758703",

  appId: "1:736735758703:web:248ef1c9e3c28aee42409a",

  measurementId: "G-8XJ8SYNVYD"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)