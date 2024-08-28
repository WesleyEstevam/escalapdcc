import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaWyvv_IjFmvDSVD85oDTvAXRebZEdzuw",
  authDomain: "escala-pdcc.firebaseapp.com",
  projectId: "escala-pdcc",
  storageBucket: "escala-pdcc.appspot.com",
  messagingSenderId: "559468371886",
  appId: "1:559468371886:web:d4922aa09d02c26a40723f",
  measurementId: "G-53TMDY0Z6W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
