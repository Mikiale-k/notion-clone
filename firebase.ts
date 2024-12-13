import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB441Is-TIMyifQEjcJr6gF1USqNK5F5wI",
    authDomain: "notion-clone-aadee.firebaseapp.com",
    projectId: "notion-clone-aadee",
    storageBucket: "notion-clone-aadee.firebasestorage.app",
    messagingSenderId: "998261501549",
    appId: "1:998261501549:web:4151889ceaef206631d964"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db }