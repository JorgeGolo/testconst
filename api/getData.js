import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Inicializa la app de Firebase (asegúrate de usar las variables de entorno en Vercel)
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
      // Obtenemos todos los documentos de la colección "articulos"
      const articulosSnapshot = await getDocs(collection(db, 'articulos'));

      if (articulosSnapshot.empty) {
        return res.status(404).json({ error: 'No se encontraron artículos.' });
      }

      // Seleccionamos un documento aleatorio de la colección "articulos"
      const randomIndex = Math.floor(Math.random() * articulosSnapshot.docs.length);
      const randomArticuloDoc = articulosSnapshot.docs[randomIndex];
      const data = randomArticuloDoc.data();

      // Extraemos los campos o establecemos valores vacíos si no están presentes
      const contenido = data.contenido || '';
      const seccion = data.seccion || '';
      const capitulo = data.capitulo || '';
      const titulo = data.titulo || '';

      res.status(200).json({
        articulo: randomArticuloDoc.id,
        contenido,
        seccion,
        capitulo,
        titulo,
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).json({ error: 'Error al obtener los datos.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
