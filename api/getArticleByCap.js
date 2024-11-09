import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';
import { OpenAI } from 'openai';

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      // Consulta a la API de OpenAI para generar la pregunta
      let respuestaIA;
      try {
        const chatCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Usa el modelo recibido o uno por defecto
          messages: [
            { role: "system", content: "Eres un asistente útil que genera preguntas de quiz con cuatro opciones de respuesta." },
            {
              role: "user",
              content: `Genera una pregunta sobre el siguiente contenido: ${contenido}. Debes incluir cuatro opciones de respuesta y solo una debe ser correcta.
              Sigue este formato:
              
              Pregunta
              Respuesta 1
              Respuesta 2
              Respuesta 3
              Respuesta 4
              1
              
              Es importante que no pongas números, letras, ni símbolos delante de las respuestas.
              La pregunta debe ir en una sola línea, y cada respuesta en una línea para cada una.`
            }
          ]
        });

        // Procesar la respuesta de OpenAI
        respuestaIA = chatCompletion.choices[0].message.content;
      } catch (error) {
        console.error('Error al generar la pregunta con OpenAI:', error);
        respuestaIA = 'Error al generar la pregunta.';
      }

      // Respuesta final al cliente
      res.status(200).json({
        titulo,
        capitulo,
        seccion,
        articulo,
        contenido,
        respuestaIA,
      });

    } catch (error) {
      console.error('Error al obtener el artículo:', error);
      res.status(500).json({ error: 'Error al obtener el artículo.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
