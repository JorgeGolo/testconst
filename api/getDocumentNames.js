import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Obtener los nombres de los documentos de la colección `constitucion`
      const constitucionSnapshot = await getDocs(collection(db, 'constitucion'));
      const documentNames = constitucionSnapshot.docs.map(doc => doc.id);

      res.status(200).json({ documentNames });
    } catch (error) {
      console.error('Error al obtener los nombres de los documentos:', error);
      res.status(500).json({ error: 'Error al obtener los nombres de los documentos.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
