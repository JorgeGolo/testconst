import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Inicializa la app de Firebase
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
      const { titulo } = req.query;
      let articulosSnapshot;

      if (titulo) {
        const articulosQuery = query(collection(db, 'articulos'), where('titulo', '==', titulo));
        articulosSnapshot = await getDocs(articulosQuery);
      } else {
        articulosSnapshot = await getDocs(collection(db, 'articulos'));
      }

      if (articulosSnapshot.empty) {
        return res.status(404).json({ error: 'No se encontraron artículos con el título especificado.' });
      }

      const randomIndex = Math.floor(Math.random() * articulosSnapshot.docs.length);
      const randomArticuloDoc = articulosSnapshot.docs[randomIndex];
      const data = randomArticuloDoc.data();

      const contenido = data.contenido || '';
      const seccion = data.seccion || '';
      const capitulo = data.numerocapitulo || '';
      const tituloFinal = data.titulo || '';
      const nombreart = data.nombre || '';

      const concatenado = `${tituloFinal} ${capitulo} ${seccion} ${nombreart} ${contenido}`;

      let respuestaIA;
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const schema = {
          question: 'string',
          options: ['string', 'string', 'string', 'string'], // Siempre cuatro respuestas.
          correctAnswer: 'number', // Índice de la respuesta correcta: 1, 2, 3 o 4.
        };

        const prompt = `
          Usa el siguiente contenido para generar un test basado en el esquema JSON proporcionado.
          El contenido es: ${concatenado}.
          Asegúrate de que:
          - Hay exactamente cuatro opciones de respuesta.
          - Una de ellas es la correcta, identificada por su índice (1 a 4).
          - Devuelves el resultado en formato JSON con el esquema definido.
        `;

        const result = await model.generateContent({
          prompt,
          responseSchema: schema,
        });

        respuestaIA = result.response;
      } catch (error) {
        console.error('Error al generar la pregunta con Gemini API:', error);
        respuestaIA = {
          error: 'Error al generar la pregunta.',
        };
      }

      res.status(200).json({
        articulo: randomArticuloDoc.id,
        titulo: tituloFinal,
        contenido,
        seccion,
        capitulo,
        respuestaIA,
      });

    } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).json({ error: 'Error al obtener los datos.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
