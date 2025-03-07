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
        // Buscar la última palabra que parezca un ID alfanumérico
        const words = name.split(' ');
        // Tomar la última palabra si existe
        if (words.length > 0) {
            return words[words.length - 1];
        }
        return name; // Si no hay espacios, devuelve el nombre completo
    };
    
    // Función para seleccionar un elemento aleatorio de un array
    const getRandomElement = (array) => {
        if (!array || array.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    };

    const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true });

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
                setError("Ocurrió un error al cargar la página."); // Establecer el mensaje de error
            }
        };

        fetchPageContent();
    }, [titulo, location.state]);

    // Obtener un subtema aleatorio
    const randomSubtema = getRandomElement(subtemaNames);
    const listoparaia = randomSubtema ? processName(randomSubtema) : "";

    useEffect(() => {
        const fetchRandomPageContent = async () => {
            try {
                const response = await fetch(`/api/getPageContentById?pageId=${encodeURIComponent(listoparaia)}`);
                if (!response.ok) {
                    throw new Error("Error al obtener el contenido de la página");
                }
                const data = await response.json();
                setRandomPageContent(data);

            } catch (err) {
                console.error("Error:", err);
                setError("Ocurrió un error al cargar la página."); // Establecer el mensaje de error
            }
        };
        fetchRandomPageContent();

    }, [listoparaia]);

    const processContent = (content) => {
        {JSON.stringify(content)};
    }

    return (
        <div>
            {titulo}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error */}

            <ul>
                {listoparaia && (
                    <li>{listoparaia}</li>
                )}
            </ul>

            <div>
                {randomPageContent && (

                    <div>{processContent(randomPageContent)}</div>

                )}
            </div>
        </div>
    );
};

export default TestNotion;