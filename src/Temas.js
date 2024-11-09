import React, { useEffect, useState } from 'react';
import Nav from './Nav';

const Temas = () => {
  const [documentNames, setDocumentNames] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [capitulo, setCapitulo] = useState('');
  const [seccion, setSeccion] = useState('');
  const [articulo, setArticulo] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    const fetchDocumentNames = async () => {
      try {
        const response = await fetch('/api/getDocumentNames');
        const data = await response.json();
        setDocumentNames(data.documentNames);
      } catch (error) {
        console.error('Error al obtener los nombres de los documentos:', error);
      }
    };

    fetchDocumentNames();
  }, []);

  const obtenerArticulo = async (nombreDocumento) => {
    console.log("Nombre del documento:", nombreDocumento);
    try {
      const response2 = await fetch('/api/getData'); // Llamada a la API
      const data2 = await response2.json();

      if (response2.ok) {
        setTitulo(data2.titulo);
        setCapitulo(data2.capitulo);
        setSeccion(data2.seccion);
        setArticulo(data2.articulo);
        setContenido(data2.contenido);
      } else {
        console.error('Error al obtener los datos:', data2.error);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  return (
    <div>
      <Nav />
      <h2>Temas</h2>
      <ul>
        {documentNames.map((name, index) => (
          <li key={index}>
            {name} - <button onClick={() => obtenerArticulo(name)}>Obtener Artículo</button>
          </li>
        ))}
      </ul>
      {/* Aquí podrías mostrar los datos obtenidos */}
      <h3>{titulo}</h3>
      <p>{capitulo}</p>
      <p>{seccion}</p>
      <p>{articulo}</p>
      <p>{contenido}</p>
    </div>
  );
};

export default Temas;
