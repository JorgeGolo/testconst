import React, { useState, useEffect } from 'react';

function App() {
  const [titulo, setTitulo] = useState(null);
  const [coleccion, setColeccion] = useState(null);
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [contenido, setContenido] = useState(null);

  useEffect(() => {
    const obtenerConsultaAleatoria = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/consulta-aleatoria`);
        const data = await response.json();

        setTitulo(data.titulo);
        setColeccion(data.coleccion);
        setCapitulo(data.capitulo);
        setSeccion(data.seccion);
        setArticulo(data.articulo);
        setContenido(data.contenido);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerConsultaAleatoria();
  }, []);

  return (
    <div className="App">
      <h1>Consulta Aleatoria</h1>
      <p><strong>Título:</strong> {titulo}</p>
      {/* Mostrar capítulo solo si no es "No aplica" */}
      {capitulo !== "No aplica" && (
        <p><strong>Capítulo:</strong> {capitulo}</p>
      )}
      
      {/* Mostrar sección solo si no es "No aplica" */}
      {seccion !== "No aplica" && (
        <p><strong>Sección:</strong> {seccion}</p>
      )}
      <p><strong>Artículo:</strong> {articulo}</p>

      {/* Mostrar el contenido HTML */}
      <div>
        <div dangerouslySetInnerHTML={{ __html: contenido }} />
      </div>
    </div>
  );
}

export default App;
