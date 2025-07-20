import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGlEXrHZyMcoeud_6DdasqjtXvZe_CaMk",
  authDomain: "locallink-ec4b3.firebaseapp.com",
  projectId: "locallink-ec4b3",
  storageBucket: "locallink-ec4b3.appspot.com", // fixed value
  messagingSenderId: "123531586876",
  appId: "1:123531586876:web:66b63fac34292dc4fb0239",
  measurementId: "G-EC7D0MXW2G"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 