// /api/getData.js

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
    try {
      // Tu lógica de consulta aquí
      const titulosSnapshot = await getDocs(collection(db, 'constitucion'));
      const titulos = titulosSnapshot.docs.map(doc => doc.id);
      const titulosFiltrados = titulos.filter(titulo => titulo !== "Preámbulo");
      const randomTitulo = titulosFiltrados[Math.floor(Math.random() * titulosFiltrados.length)];
  
      const tituloRef = doc(db, 'constitucion', randomTitulo);
  
      const articulosSnapshot = await getDocs(collection(tituloRef, 'articulos'));
      const capitulosSnapshot = await getDocs(collection(tituloRef, 'capitulos'));
  
      const collectionsDisponibles = [];
      if (articulosSnapshot.docs.length > 0) collectionsDisponibles.push('articulos');
      if (capitulosSnapshot.docs.length > 0) collectionsDisponibles.push('capitulos');
  
      if (collectionsDisponibles.length === 0) {
        return res.status(404).json({ error: 'No se encontraron artículos ni capítulos en este título.' });
      }
  
      const randomCollection = collectionsDisponibles[Math.floor(Math.random() * collectionsDisponibles.length)];
  
      let randomArticulo = null;
      let contenido = null;
      let randomCapitulo = null;  
      let randomSeccion = null;
  
      if (randomCollection === 'articulos') {
        const randomArticuloDoc = articulosSnapshot.docs[Math.floor(Math.random() * articulosSnapshot.docs.length)];
        randomArticulo = randomArticuloDoc.id;
        contenido = randomArticuloDoc.data().contenido;
      } else if (randomCollection === 'capitulos') {
        const randomCapituloDoc = capitulosSnapshot.docs[Math.floor(Math.random() * capitulosSnapshot.docs.length)];
        randomCapitulo = randomCapituloDoc.id;
  
        const capituloRef = doc(tituloRef, 'capitulos', randomCapitulo);
        const capituloArticulosSnapshot = await getDocs(collection(capituloRef, 'articulos'));
        const capituloSeccionesSnapshot = await getDocs(collection(capituloRef, 'secciones'));
  
        const capituloCollectionsDisponibles = [];
        if (capituloArticulosSnapshot.docs.length > 0) capituloCollectionsDisponibles.push('articulos');
        if (capituloSeccionesSnapshot.docs.length > 0) capituloCollectionsDisponibles.push('secciones');
  
        if (capituloCollectionsDisponibles.length === 0) {
          return res.status(404).json({ error: `No se encontraron artículos ni secciones en el capítulo: ${randomCapitulo}` });
        }
  
        const randomCapituloCollection = capituloCollectionsDisponibles[Math.floor(Math.random() * capituloCollectionsDisponibles.length)];
  
        if (randomCapituloCollection === 'articulos') {
          const randomArticuloDoc = capituloArticulosSnapshot.docs[Math.floor(Math.random() * capituloArticulosSnapshot.docs.length)];
          randomArticulo = randomArticuloDoc.id;
          contenido = randomArticuloDoc.data().contenido;
        } else if (randomCapituloCollection === 'secciones') {
          const randomSeccionDoc = capituloSeccionesSnapshot.docs[Math.floor(Math.random() * capituloSeccionesSnapshot.docs.length)];
          randomSeccion = randomSeccionDoc.id;
  
          const seccionRef = doc(capituloRef, 'secciones', randomSeccion);
          const articulosSeccionSnapshot = await getDocs(collection(seccionRef, 'articulos'));
  
          if (articulosSeccionSnapshot.docs.length > 0) {
            const randomArticuloDoc = articulosSeccionSnapshot.docs[Math.floor(Math.random() * articulosSeccionSnapshot.docs.length)];
            randomArticulo = randomArticuloDoc.id;
            contenido = randomArticuloDoc.data().contenido;
          }
        }
      }
  
      if (!contenido) {
        return res.status(404).json({ error: 'No se encontró contenido de artículo.' });
      }
  
      res.status(200).json({
        titulo: randomTitulo,
        capitulo: randomCapitulo || 'No aplica',
        seccion: randomSeccion || 'No aplica',
        articulo: randomArticulo,
        contenido,
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).json({ error: 'Error al obtener los datos.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
