import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Groq from "groq-sdk";

const TestNotion = () => {
  const { titulo } = useParams();
  const location = useLocation();
  const [pageContent, setPageContent] = useState(null);
  const [subtemaNames, setSubtemaNames] = useState([]);
  const [subtemaIds, setSubtemaIds] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [randomPageContent, setRandomPageContent] = useState(null);
  const [selectedSubtema, setSelectedSubtema] = useState(""); // Se asignará solo una vez

  // Función para procesar el nombre y obtener solo la segunda parte
  const processName = (name) => {
    if (!name) return "";
    const words = name.split(' ');
    return words.length > 0 ? words[words.length - 1] : name;
  };

  // Función para seleccionar un elemento aleatorio de un array
  const getRandomElement = (array) => {
    if (!array || array.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const groq = new Groq({ 
    apiKey: process.env.REACT_APP_GROQ_API_KEY, 
    dangerouslyAllowBrowser: true 
  });

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(`/api/getPageContentByName?pageName=${encodeURIComponent(titulo)}`);
        if (!response.ok) {
          throw new Error("Error al obtener el contenido de la página");
        }
        const data = await response.json();
        setPageContent(data);

        if (
          data && 
          data.properties && 
          data.properties['AWS Subtemas'] && 
          data.properties['AWS Subtemas'].relation
        ) {
          const ids = data.properties['AWS Subtemas'].relation.map(subtema => subtema.id);
          setSubtemaIds(ids);
        }

        if (location.state && location.state.subtemaNames) {
          const subtemas = location.state.subtemaNames;
          if (Array.isArray(subtemas)) {
            setSubtemaNames(subtemas);
          } else {
            console.error('subtemaNames no es un array:', subtemas);
            setError('Error al cargar subtemas.');
          }
        }

      } catch (err) {
        console.error("Error:", err);
        setError("Ocurrió un error al cargar la página.");
      }
    };

    fetchPageContent();
  }, [titulo, location.state]);

  // Seleccionar un subtema aleatorio solo una vez cuando se disponga de los subtemas
  useEffect(() => {
    if (!selectedSubtema && subtemaNames.length > 0) {
      const random = getRandomElement(subtemaNames);
      setSelectedSubtema(random ? processName(random) : "");
    }
  }, [subtemaNames, selectedSubtema]);

  // Función para extraer todo el texto plano de los bloques
  const extractPlainText = (blocks) => {
    let plainText = "";
    blocks.forEach(block => {
      const type = block.type;
      if (block[type] && Array.isArray(block[type].rich_text)) {
        block[type].rich_text.forEach(textItem => {
          plainText += textItem.plain_text + " ";
        });
      }
    });
    return plainText.trim();
  };

  const allPlainText =
    randomPageContent && randomPageContent.results
      ? extractPlainText(randomPageContent.results)
      : "";

  // Cargar contenido de página aleatoria solo una vez, cuando selectedSubtema ya esté definido
  useEffect(() => {
    if (!selectedSubtema) return;
    const fetchRandomPageContent = async () => {
      try {
        const response = await fetch(`/api/getPageContentById?pageId=${encodeURIComponent(selectedSubtema)}`);
        if (!response.ok) {
          throw new Error("Error al obtener el contenido de la página");
        }
        const data = await response.json();
        setRandomPageContent(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Ocurrió un error al cargar la página.");
      }
    };
    fetchRandomPageContent();
  }, [selectedSubtema]);

// Función para recargar el contenido aleatorio con un nuevo subtema
const handleNext = () => {
    if (subtemaNames.length > 0) {
      const random = getRandomElement(subtemaNames);
      setSelectedSubtema(random ? processName(random) : "");
      setRandomPageContent(null); // Opcional: reiniciar el contenido antes de la recarga
    }
  };

  return (
    <div>
      <h1>{titulo}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {selectedSubtema && <li>{selectedSubtema}</li>}
      </ul>

      <div>
        {randomPageContent && (
          <div>
            <h3>Contenido de la página:</h3>
            <p>{allPlainText}</p>

            <hr/>
            <button onClick={handleNext}>Siguiente</button>

          </div>
        )}
      </div>
    </div>
  );
};

export default TestNotion;
