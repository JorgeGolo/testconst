import React, { useState, useEffect } from 'react'; 
import { initializeApp } from 'firebase/app'; 
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';

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

function App() {
  const [titulo, setTitulo] = useState(null);
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [contenido, setContenido] = useState(null);

  useEffect(() => {
    const obtenerConsultaAleatoria = async () => {
      try {
        // Obtenemos todos los documentos dentro de la colección 'constitucion'
        const titulosSnapshot = await getDocs(collection(db, 'constitucion'));
        const titulos = titulosSnapshot.docs.map(doc => doc.id);
  
        // Filtramos el título "Preámbulo"
        const titulosFiltrados = titulos.filter(titulo => titulo !== "Preámbulo");
        const randomTitulo = titulosFiltrados[Math.floor(Math.random() * titulosFiltrados.length)];
  
        const tituloRef = doc(db, 'constitucion', randomTitulo);
  
        // Verificamos si las colecciones 'articulos' y 'capitulos' existen
        const articulosSnapshot = await getDocs(collection(tituloRef, 'articulos'));
        const capitulosSnapshot = await getDocs(collection(tituloRef, 'capitulos'));
  
        // Obtenemos un array con las colecciones disponibles
        const collectionsDisponibles = [];
        if (articulosSnapshot.docs.length > 0) collectionsDisponibles.push('articulos');
        if (capitulosSnapshot.docs.length > 0) collectionsDisponibles.push('capitulos');
  
        // Si no hay ninguna colección disponible, terminamos
        if (collectionsDisponibles.length === 0) {
          console.log('No se encontraron artículos ni capítulos en este título.');
          return;
        }
  
        // Elegimos una colección aleatoriamente entre las disponibles
        const randomCollection = collectionsDisponibles[Math.floor(Math.random() * collectionsDisponibles.length)];
  
        let randomArticulo = null;
        let contenido = null;
        let randomCapitulo = null;  
        let randomSeccion = null;
  
        if (randomCollection === 'articulos') {
          // Si es una colección de artículos, seleccionamos uno al azar
          const articulos = articulosSnapshot.docs;
          const randomArticuloDoc = articulos[Math.floor(Math.random() * articulos.length)];
          randomArticulo = randomArticuloDoc.id;
          contenido = randomArticuloDoc.data().contenido;
        } else if (randomCollection === 'capitulos') {
          // Si es una colección de capítulos, seleccionamos un capítulo aleatorio
          const capitulos = capitulosSnapshot.docs;
          const randomCapituloDoc = capitulos[Math.floor(Math.random() * capitulos.length)];
          randomCapitulo = randomCapituloDoc.id;
  
          // Obtenemos las colecciones dentro del capítulo seleccionado
          const capituloRef = doc(tituloRef, 'capitulos', randomCapitulo);
          const capituloArticulosSnapshot = await getDocs(collection(capituloRef, 'articulos'));
          const capituloSeccionesSnapshot = await getDocs(collection(capituloRef, 'secciones'));
  
          // Verificamos si hay artículos o secciones dentro del capítulo
          const capituloCollectionsDisponibles = [];
          if (capituloArticulosSnapshot.docs.length > 0) capituloCollectionsDisponibles.push('articulos');
          if (capituloSeccionesSnapshot.docs.length > 0) capituloCollectionsDisponibles.push('secciones');
  
          if (capituloCollectionsDisponibles.length === 0) {
            console.log(`No se encontraron artículos ni secciones en el capítulo: ${randomCapitulo}`);
            return;
          }
  
          // Elegimos aleatoriamente entre artículos o secciones dentro del capítulo
          const randomCapituloCollection = capituloCollectionsDisponibles[Math.floor(Math.random() * capituloCollectionsDisponibles.length)];
  
          if (randomCapituloCollection === 'articulos') {
            // Seleccionamos un artículo dentro del capítulo
            const articulosCapitulo = capituloArticulosSnapshot.docs;
            const randomArticuloDoc = articulosCapitulo[Math.floor(Math.random() * articulosCapitulo.length)];
            randomArticulo = randomArticuloDoc.id;
            contenido = randomArticuloDoc.data().contenido;
          } else if (randomCapituloCollection === 'secciones') {
            // Seleccionamos una sección dentro del capítulo
            const secciones = capituloSeccionesSnapshot.docs;
            const randomSeccionDoc = secciones[Math.floor(Math.random() * secciones.length)];
            randomSeccion = randomSeccionDoc.id;
  
            // Dentro de la sección, seleccionamos un artículo
            const seccionRef = doc(capituloRef, 'secciones', randomSeccion);
            const articulosSeccionSnapshot = await getDocs(collection(seccionRef, 'articulos'));
            const articulosSeccion = articulosSeccionSnapshot.docs;
  
            if (articulosSeccion.length > 0) {
              const randomArticuloDoc = articulosSeccion[Math.floor(Math.random() * articulosSeccion.length)];
              randomArticulo = randomArticuloDoc.id;
              contenido = randomArticuloDoc.data().contenido;
            } else {
              console.log(`No se encontraron artículos en la sección: ${randomSeccion}`);
            }
          }
        }
  
        if (!contenido) {
          console.log('No se encontró contenido de artículo');
          return;
        }
  
        // Actualizamos el estado con los datos obtenidos
        setTitulo(randomTitulo);
        setCapitulo(randomCapitulo || 'No aplica');
        setSeccion(randomSeccion || 'No aplica');
        setArticulo(randomArticulo);
        setContenido(contenido);
  
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
  
    obtenerConsultaAleatoria();
  }, []);
  

  return (
    <div>
      <p>{titulo}</p>
      {capitulo !== 'No aplica' && <p>{capitulo}</p>}
      {seccion !== 'No aplica' && <p>{seccion}</p>}
      <p>{articulo}</p>
      <div dangerouslySetInnerHTML={{ __html: contenido }} />
    </div>
  );
}

export default App;
