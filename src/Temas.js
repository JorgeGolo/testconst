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

  return (
    <div>
      <Nav />
      <h2>Temas</h2>
      <ul>
        {documentNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Temas;
