import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importar Firestore

// La configuración de Firebase de tu aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyAwS3RrPYPKjp3WdTVbsR0xqhQwzaAcMcY",
  authDomain: "auratune-ai.firebaseapp.com",
  projectId: "auratune-ai",
  storageBucket: "auratune-ai.appspot.com",
  messagingSenderId: "381269265627",
  appId: "1:381269265627:web:314ef9aeaff4f0b2cb50fe",
  measurementId: "G-8ELWW8YH18"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); // Inicializar Firestore

export { app, auth, googleProvider, db }; // Exportar db
