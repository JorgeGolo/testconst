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

        if (data && data.properties && data.properties['AWS Subtemas'] && data.properties['AWS Subtemas'].relation) {
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

  // Obtener un subtema aleatorio y procesar su nombre
  const randomSubtema = getRandomElement(subtemaNames);
  const listoparaia = randomSubtema ? processName(randomSubtema) : "";

  // Función para extraer todo el texto plano de los bloques
  function extractPlainText(blocks) {
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
  }

  // Calcular todo el texto plano si randomPageContent está disponible
  const allPlainText =
    randomPageContent && randomPageContent.results
      ? extractPlainText(randomPageContent.results)
      : "";

  useEffect(() => {
    const fetchRandomPageContent = async () => {
      if (!listoparaia) return; // Evitar ejecutar el hechizo si no hay valor
      try {
        const response = await fetch(`/api/getPageContentById?pageId=${encodeURIComponent(listoparaia)}`);
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
  }, [listoparaia]);

  return (
    <div>
      <h1>{titulo}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {listoparaia && <li>{listoparaia}</li>}
      </ul>

      <div>
        {randomPageContent && (
          <div>
            <h3>Contenido de la página:</h3>
            <p>{allPlainText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestNotion;
