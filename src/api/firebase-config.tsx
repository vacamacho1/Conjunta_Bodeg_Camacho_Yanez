import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyBxNtIESZ5WJIgu6IbJybwacCFyYEAo9Ec",
  authDomain: "nuevo-inventario.firebaseapp.com",
  projectId: "nuevo-inventario",
  storageBucket: "nuevo-inventario.appspot.com",
  messagingSenderId: "489219148316",
  appId: "1:489219148316:web:3a5dd5fa0cff510ad9edd9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Inicializa y exporta db
