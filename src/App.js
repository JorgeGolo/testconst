import React, { useState, useEffect } from 'react';

function App() {
  const [titulo, setTitulo] = useState(null);
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [contenido, setContenido] = useState(null);
  const [openAIText, setOpenAIText] = useState(null);  // Agrega un estado para openAIText

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
          setOpenAIText(data.openAIText);  // Establecer el resultado de OpenAI

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
      <h1>{titulo}</h1>
      {capitulo !== 'No aplica' && <p><strong>Capítulo:</strong> {capitulo}</p>}
      {seccion !== 'No aplica' && <p><strong>Sección:</strong> {seccion}</p>}
      <p><strong>Artículo:</strong> {articulo}</p>
      <div dangerouslySetInnerHTML={{ __html: contenido }} />
      
      {/* Mostrar el resultado de OpenAI */}
      {openAIText && (
        <div>
          <h2>Resumen del Artículo</h2>
          <p>{openAIText}</p>
        </div>
      )}
    </div>
  );
}

export default App;
