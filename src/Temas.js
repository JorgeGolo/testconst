import React, { useEffect, useState } from 'react';
import Nav from './Nav';

const Temas = () => {
  const [documentNames, setDocumentNames] = useState([]);

  useEffect(() => {
    // Función para obtener los nombres de los documentos desde la API
    const fetchDocumentNames = async () => {
      try {
        const response = await fetch('/api/getDocumentNames'); // Ruta de la API
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
          <li key={index}>{name} - <button onClick={() => { obtenerArticulo(name); }}>Obtener Artículo</button></li>
        ))}
      </ul>
    </div>
  );
};

export default Temas;
