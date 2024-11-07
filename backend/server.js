const express = require('express');
const admin = require('firebase-admin');
const path = require('path'); // Para facilitar la ruta de la clave de servicio

const app = express();
const port = 5000;
const cors = require('cors'); // Importa el paquete cors


// Ruta a la clave de servicio
const serviceAccount = require(path.join(__dirname, 'firebaseServiceAccount.json'));

app.use(cors({
    origin: 'http://localhost:3000'
  }));

// Inicializar Firebase Admin con la clave de servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reacttest-32606.firebaseio.com"  // Cambia esto si tienes una URL diferente en tu Firebase
});

const db = admin.firestore();  // Conexión con Firestore

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

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

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
  