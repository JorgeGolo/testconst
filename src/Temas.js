import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';

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
    const { documentName } = req.query; // Obtener el nombre del documento desde la solicitud

    if (!documentName) {
      return res.status(400).json({ error: 'Se requiere el nombre del documento' });
    }

    try {
      const tituloRef = doc(db, 'constitucion', documentName);
      const articulosSnapshot = await getDocs(collection(tituloRef, 'articulos'));
      const capitulosSnapshot = await getDocs(collection(tituloRef, 'capitulos'));

      let titulo = documentName;
      let capitulo = null;
      let seccion = null;
      let articulo = null;
      let contenido = null;

      if (capitulosSnapshot.docs.length > 0) {
        const capituloDoc = capitulosSnapshot.docs[0];
        capitulo = capituloDoc.id;

        const seccionesSnapshot = await getDocs(collection(capituloDoc.ref, 'secciones'));
        if (seccionesSnapshot.docs.length > 0) {
          const seccionDoc = seccionesSnapshot.docs[0];
          seccion = seccionDoc.id;

          const seccionArticulosSnapshot = await getDocs(collection(seccionDoc.ref, 'articulos'));
          if (seccionArticulosSnapshot.docs.length > 0) {
            const articuloDoc = seccionArticulosSnapshot.docs[0];
            articulo = articuloDoc.id;
            contenido = articuloDoc.data().contenido;
          }
        }
      } else if (articulosSnapshot.docs.length > 0) {
        const articuloDoc = articulosSnapshot.docs[0];
        articulo = articuloDoc.id;
        contenido = articuloDoc.data().contenido;
      }

      if (!contenido) {
        return res.status(404).json({ error: 'No se encontró contenido de artículo.' });
      }

      res.status(200).json({
        titulo,
        capitulo,
        seccion,
        articulo,
        contenido,
      });
    } catch (error) {
      console.error('Error al obtener el artículo:', error);
      res.status(500).json({ error: 'Error al obtener el artículo.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
