import React, { useState, useEffect } from 'react';
import Nav from './Nav';

function App() {
  const [titulo, setTitulo] = useState(null);
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [contenido, setContenido] = useState(null);
 // const [respuestaIA, setRespuestaIA] = useState('');

  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);


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
          //setRespuestaIA(data.respuestaIA);

          // Procesar `respuestaIA` para extraer la pregunta, opciones y respuesta correcta
          const lines = data.respuestaIA.split('\n').filter(line => line.trim() !== '');
          setPregunta(lines[0]);
          setOpciones(lines.slice(1, 5));
          setRespuestaCorrecta(parseInt(lines[5], 10)); // Convertir el número a entero

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
      {/*<p>{respuestaIA}</p>*/}

      {/*Respuesta de la IA formateada*/}
      <ul>
        {opciones.map((opcion, index) => (
          <li key={index} style={{ fontWeight: index + 1 === respuestaCorrecta ? 'bold' : 'normal' }}>
            {opcion}
          </li>
        ))}
      </ul>

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
