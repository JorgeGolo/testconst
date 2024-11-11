import React, { useState, useEffect } from 'react';
import Nav from './Nav';

function App() {
  const [titulo, setTitulo] = useState(null);
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [contenido, setContenido] = useState(null);
  const [respuestaIA, setRespuestaIA] = useState('');

  useEffect(() => {
    const obtenerConsultaAleatoria = async () => {
      try {
        const response = await fetch('/api/getData'); // Llamada a la API
        const data = await response.json();

        if (response.ok) {
          setTitulo(data.titulo);
          setCapitulo(data.capitulo);
          setSeccion(data.seccion);
          setArticulo(data.articulo);
          setContenido(data.contenido);
          setRespuestaIA(data.respuestaIA);

        } else {
          console.error('Error al obtener los datos:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerConsultaAleatoria();
  }, []);

  return (
    <div>
      <Nav/>
      <p>{respuestaIA}</p>
      <hr/>
      {titulo !== '' && <p>{titulo}</p>}
      {capitulo !== '' && <p>Capítulo {capitulo}</p>}
      {seccion !== '' && <p>Sección {seccion}</p>}
      <p>{articulo}</p>
      <div dangerouslySetInnerHTML={{ __html: contenido }} />
    </div>
  );
}

export default App;
