import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAgMeZAPJmmGUJ7TDxzNSzzLMyKuNn45YY",
  authDomain: "fangetter-57764.firebaseapp.com",
  projectId: "fangetter-57764",
  storageBucket: "fangetter-57764.appspot.com",
  messagingSenderId: "699562415198",
  appId: "1:699562415198:web:4aac729fc6d454450690cf",
  measurementId: "G-D6VQEEDQBR",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
