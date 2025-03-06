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

    return (
        <div>
            {titulo}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error */}
            {pageContent && (
                <div>
                    {JSON.stringify(pageContent)}

                    {subtemaNames.length > 0 && (
                        <div>
                            <h3>Subtemas:</h3>
                            <ul>
                            {subtemaNames.map(function(name) {
                                return <li key={name}>{processName(name)}</li>;
                            })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestNotion;