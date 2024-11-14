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

      if (titulo && titulo !== 'constitucion') {
        // Si se proporciona un título, buscamos artículos que coincidan con ese título
        const articulosQuery = query(collection(db, 'articulos'), where('titulo', '==', titulo));
        articulosSnapshot = await getDocs(articulosQuery);
      } else {
        // Si no se proporciona un título, obtenemos todos los artículos
        articulosSnapshot = await getDocs(collection(db, 'articulos'));
      }

      if (articulosSnapshot.empty) {
        return res.status(404).json({ error: 'No se encontraron artículos con el título especificado.' });
      }

      // Seleccionamos un artículo aleatorio de la lista de resultados
      const randomIndex = Math.floor(Math.random() * articulosSnapshot.docs.length);
      const randomArticuloDoc = articulosSnapshot.docs[randomIndex];
      const data = randomArticuloDoc.data();

      // Extraemos los campos o establecemos valores vacíos si no están presentes
      const contenido = data.contenido || '';
      const seccion = data.seccion || '';
      const contenidoseccion = data.contenidoseccion || '';
      const capitulo = data.numerocapitulo || '';
      const contenidocapitulo = data.contenidocapitulo || '';
      const tituloFinal = data.titulo || '';
      const nombreart = data.nombre || '';
      const contenidotitulo = data.contenidotitulo || '';

      const concatenado = `${tituloFinal} ${contenidotitulo} ${capitulo} ${contenidocapitulo} ${seccion} ${contenidoseccion} ${nombreart} ${contenido}`;

      let respuestaIA;
      try {
        // Configuramos el modelo y el prompt para la API de Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
          Genera una pregunta sobre el siguiente contenido: ${concatenado}.
          Debes incluir cuatro opciones de respuesta y solo una debe ser correcta, las otras tres incorrectas.
          Sigue este formato:
          
          Texto de la pregunta
          Texto de respuesta 
          Texto de respuesta
          Texto de respuesta
          Texto de respuesta
          1
          
          Es importante que no pongas números, letras, ni símbolos delante de las respuestas.
          La pregunta debe ir en una sola línea, y cada respuesta en una línea para cada una.
          El último número es la respuesta correcta, marcada como números del 1 al 4.
          Ejemplo de formato:

          ¿En qué año se proclamó la Constitución?
          1940
          2000
          1978
          1950
          3
        `;

        const result = await model.generateContent(prompt);
        respuestaIA = result.response.text();

      } catch (error) {
        console.error('Error al generar la pregunta con Gemini API:', error);
        respuestaIA = 'Error al generar la pregunta.';
      }

      res.status(200).json({
        articulo: randomArticuloDoc.id,
        contenido,
        seccion,
        contenidoseccion,
        contenidotitulo,
        contenidocapitulo,
        capitulo,
        titulo: tituloFinal,
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
