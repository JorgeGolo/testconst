const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors'); // Importa el paquete cors

require('dotenv').config();

const app = express();
//const port = 5000;

// Configuración de Firebase con datos del .env
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Para el formato correcto del salto de línea
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  }),
  databaseURL: "https://reacttest-32606.firebaseio.com" // Cambia esto si tienes una URL diferente en tu Firebase
});

const db = admin.firestore();  // Conexión con Firestore

// Middleware testconst.vercel.app

const allowedOrigins = [
  'http://localhost:3000',  // Para entorno de desarrollo
  'https://testconst.vercel.app'  // Reemplaza con tu dominio en Vercel
];

app.use(cors({
  origin: function(origin, callback) {
    // Permite todos los orígenes en desarrollo o si no se pasa origin (por ejemplo, para localhost)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));


app.use(express.json());  // Middleware para procesar JSON

// Ejemplo de endpoint que usa Firestore
app.get('/data', async (req, res) => {
  try {
    const snapshot = await db.collection('constitucion').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).send('Error al obtener datos');
  }
});

/*
app.listen(port, () => {
  console.log(`Servidor escuchando en ${process.env.REACT_APP_API_URL}`);
});
*/
app.get('/consulta-aleatoria', async (req, res) => {
    try {
      // Seleccionamos un título al azar
      const titulosSnapshot = await db.collection('constitucion').get();
      const titulos = titulosSnapshot.docs.map(doc => doc.id);
      // Filtramos el título "Preambulo" de la lista de títulos
    const titulosFiltrados = titulos.filter(titulo => titulo !== "Preámbulo");
    const randomTitulo = titulosFiltrados[Math.floor(Math.random() * titulosFiltrados.length)];
  
      const tituloRef = db.collection('constitucion').doc(randomTitulo);
      
      // Obtenemos las colecciones dentro del título
      const collectionsSnapshot = await tituloRef.listCollections();
      const collections = collectionsSnapshot.map(col => col.id);
      const randomCollection = collections[Math.floor(Math.random() * collections.length)];
  
      let randomArticulo = null;
      let contenido = null;
      let randomCapitulo = null;  // Inicializamos `randomCapitulo` y `randomSeccion` como `null`
      let randomSeccion = null;
  
      if (randomCollection === 'articulos') {
        // Si es una colección de artículos, seleccionamos uno al azar y obtenemos su contenido
        const articulosSnapshot = await tituloRef.collection('articulos').get();
        const articulos = articulosSnapshot.docs;
        const randomArticuloDoc = articulos[Math.floor(Math.random() * articulos.length)];
        randomArticulo = randomArticuloDoc.id;
        contenido = randomArticuloDoc.data().contenido;
  
      } else if (randomCollection === 'capitulos') {
        // Si es una colección de capítulos, seleccionamos un capítulo al azar
        const capitulosSnapshot = await tituloRef.collection('capitulos').get();
        const capitulos = capitulosSnapshot.docs;
        const randomCapituloDoc = capitulos[Math.floor(Math.random() * capitulos.length)];
        randomCapitulo = randomCapituloDoc.id;
  
        // Obtenemos las colecciones dentro del capítulo seleccionado
        const capituloRef = tituloRef.collection('capitulos').doc(randomCapitulo);
        const capituloCollectionsSnapshot = await capituloRef.listCollections();
        const capituloCollections = capituloCollectionsSnapshot.map(col => col.id);
        const randomCapituloCollection = capituloCollections[Math.floor(Math.random() * capituloCollections.length)];
  
        if (randomCapituloCollection === 'articulos') {
          // Si es una colección de artículos, seleccionamos un artículo aleatorio
          const articulosSnapshot = await capituloRef.collection('articulos').get();
          const articulos = articulosSnapshot.docs;
          const randomArticuloDoc = articulos[Math.floor(Math.random() * articulos.length)];
          randomArticulo = randomArticuloDoc.id;
          contenido = randomArticuloDoc.data().contenido;
  
        } else if (randomCapituloCollection === 'secciones') {
          // Si es una colección de secciones, seleccionamos una sección al azar
          const seccionesSnapshot = await capituloRef.collection('secciones').get();
          const secciones = seccionesSnapshot.docs;
          const randomSeccionDoc = secciones[Math.floor(Math.random() * secciones.length)];
          randomSeccion = randomSeccionDoc.id;
  
          // Dentro de la sección, seleccionamos un artículo aleatorio
          const seccionRef = capituloRef.collection('secciones').doc(randomSeccion);
          const articulosSeccionSnapshot = await seccionRef.collection('articulos').get();
          const articulosSeccion = articulosSeccionSnapshot.docs;
          const randomArticuloDoc = articulosSeccion[Math.floor(Math.random() * articulosSeccion.length)];
          randomArticulo = randomArticuloDoc.id;
          contenido = randomArticuloDoc.data().contenido;
        }
      }
  
      if (!contenido) {
        return res.status(404).json({ error: 'No se encontró contenido de artículo.' });
      }
  
      res.json({
        titulo: randomTitulo,
        coleccion: randomCollection,
        capitulo: randomCapitulo || 'No aplica',
        seccion: randomSeccion || 'No aplica',
        articulo: randomArticulo,
        contenido: contenido
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    }
  });
  