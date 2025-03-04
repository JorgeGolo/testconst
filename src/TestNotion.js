import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Groq from "groq-sdk";

const TestNotion = () => {
    const { titulo } = useParams();
    const location = useLocation();
    const [pageContent, setPageContent] = useState(null);
    const [subtemaNames, setSubtemaNames] = useState([]);
    const [subtemaIds, setSubtemaIds] = useState([]); // Estado para los IDs de subtemas

    const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true });

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const response = await fetch(`/api/getPageContentByName?pageName=${encodeURIComponent(titulo)}`);
                if (!response.ok) throw new Error("Error al obtener el contenido de la página");
                const data = await response.json();
                setPageContent(data);

                // Obtener IDs de subtemas de pageContent
                if (data && data.properties && data.properties['AWS Subtemas'] && data.properties['AWS Subtemas'].relation) {
                    const ids = data.properties['AWS Subtemas'].relation.map(subtema => subtema.id);
                    setSubtemaIds(ids); // Almacenar IDs en el estado
                }

                // Obtener subtemaNames del estado de navegación
                if (location.state && location.state.subtemaNames) {
                    const subtemas = location.state.subtemaNames;
                    if (Array.isArray(subtemas)) {
                        setSubtemaNames(subtemas);
                    } else {
                        console.error('subtemaNames no es un array:', subtemas);
                    }
                }

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchPageContent();
    }, [titulo, location.state]);

    return (
        <div>
            {titulo}
            {pageContent && (
                <div>
                    {JSON.stringify(pageContent)}

                    {/* Mostrar nombres de subtemas */}
                    {subtemaNames.length > 0 && (
                        <div>
                            <h3>Subtemas:</h3>
                            <ul>
                                {subtemaNames.map(name => (
                                    <li key={name}>{name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Mostrar IDs de subtemas */}
                    {subtemaIds.length > 0 && (
                        <div>
                            <h3>IDs de Subtemas:</h3>
                            <ul>
                                {subtemaIds.map(id => (
                                    <li key={id}>{id}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestNotion;