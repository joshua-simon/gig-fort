import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCr0c8XuhMQZScx894eQSC7Q-zNZokvLoA",
  authDomain: "gig-fort-f8a59.firebaseapp.com",
  projectId: "gig-fort-f8a59",
  storageBucket: "gig-fort-f8a59.appspot.com",
  messagingSenderId: "595475966846",
  appId: "1:595475966846:web:cf94b85d69696239e5212f",
  measurementId: "G-VD3XDEQRXH"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
