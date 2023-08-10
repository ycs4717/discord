import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAs4o63aWDlVnL_SfYNIjIuasUluVr8Cbo",
  authDomain: "discord-clone-udemy-e3a98.firebaseapp.com",
  projectId: "discord-clone-udemy-e3a98",
  storageBucket: "discord-clone-udemy-e3a98.appspot.com",
  messagingSenderId: "4437558391",
  appId: "1:4437558391:web:1dd7c8a842852d6d0ab272",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };
