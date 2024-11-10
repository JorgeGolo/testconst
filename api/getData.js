import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Configuration, OpenAIApi } from 'openai';

// Configuración de OpenAI
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

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
      // Obtener todos los documentos de la colección "articulos"
      const articulosSnapshot = await getDocs(collection(db, 'articulos'));

      if (articulosSnapshot.empty) {
        return res.status(404).json({ error: 'No se encontraron artículos.' });
      }

      // Selección aleatoria de un documento de la colección "articulos"
      const randomIndex = Math.floor(Math.random() * articulosSnapshot.docs.length);
      const randomArticuloDoc = articulosSnapshot.docs[randomIndex];
      const data = randomArticuloDoc.data();

      // Extraer los campos o establecer valores vacíos si no están presentes
      const contenido = data.contenido || '';
      const seccion = data.seccion || '';
      const capitulo = data.capitulo || '';
      const titulo = data.titulo || '';

      let respuestaIA;
      try {
        const chatCompletion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
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

        // Verificar y procesar la respuesta de OpenAI
        respuestaIA = chatCompletion.data.choices[0]?.message?.content || 'No se generó ninguna respuesta.';
      } catch (error) {
        console.error('Error al generar la pregunta con OpenAI:', error);
        respuestaIA = 'Error al generar la pregunta.';
      }
      
      res.status(200).json({
        articulo: randomArticuloDoc.id,
        contenido,
        seccion,
        capitulo,
        titulo,
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
