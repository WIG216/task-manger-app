import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBDpzfW-nRROLL_H0_x2-nYcQa1MNrDtzw",
  authDomain: "task-manager-70ab6.firebaseapp.com",
  databaseURL: "https://task-manager-70ab6-default-rtdb.firebaseio.com",
  projectId: "task-manager-70ab6",
  storageBucket: "task-manager-70ab6.appspot.com",
  messagingSenderId: "423155063898",
  appId: "1:423155063898:web:cff911141208d448ec4c63"
  // apiKey: process.env.apiKey,
  // authDomain: process.env.authDomain,
  // databaseURL: process.env.databaseURL,
  // projectId: process.env.projectId,
  // storageBucket: process.env.storageBucket,
  // messagingSenderId: process.env.messagingSenderId,
  // appId: process.env.appId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const database = getDatabase(app);


