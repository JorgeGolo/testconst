// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para obtener artículos desde Firebase
export async function fetchArticles(titulo) {
  let articulosSnapshot;

  if (titulo && titulo !== "constitucion") {
    const articulosQuery = query(
      collection(db, "articulos"),
      where("titulo", "==", titulo)
    );
    articulosSnapshot = await getDocs(articulosQuery);
  } else {
    articulosSnapshot = await getDocs(collection(db, "articulos"));
  }

  if (articulosSnapshot.empty) {
    throw new Error("No se encontraron artículos con el título especificado.");
  }

  // Seleccionar un artículo aleatorio
  const randomIndex = Math.floor(Math.random() * articulosSnapshot.docs.length);
  const randomArticuloDoc = articulosSnapshot.docs[randomIndex];
  return randomArticuloDoc.data();
}