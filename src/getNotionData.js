import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const GetNotionData = () => {
    const navigate = useNavigate();
    const [notionData, setNotionData] = useState([]);
    const [pageContents, setPageContents] = useState({}); // Nuevo estado para el contenido

    const startTitleNotionTest = (title) => {
        navigate(`/notiontest/${title}`);
    }

    useEffect(() => {
        const fetchNotionData = async () => {
            try {
                const response = await fetch("/api/notion");
                if (!response.ok) throw new Error("Error al obtener datos");
                const data = await response.json();
                setNotionData(data.results);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchNotionData();
    }, []);

    useEffect(() => {
        const fetchPageContent = async (pageId) => {
            try {
                const response = await fetch(`/api/notion/page/${pageId}`);
                if (!response.ok) throw new Error("Error al obtener el contenido de la página");
                const data = await response.json();
                setPageContents(prev => ({ ...prev, [pageId]: data })); // Almacena el contenido
            } catch (error) {
                console.error("Error:", error);
            }
        };

        notionData.forEach(item => {
            fetchPageContent(item.id);
        });
    }, [notionData]);

    return (
        <ul>
            {notionData
                .slice()
                .sort((a, b) => {
                    const fechaA = a.properties['Fecha inicio']?.date?.start;
                    const fechaB = b.properties['Fecha inicio']?.date?.start;

                    if (!fechaA) return 1;
                    if (!fechaB) return -1;

                    return new Date(fechaA) - new Date(fechaB);
                })
                .map((item) => (
                    <li
                        onClick={() => startTitleNotionTest(item.properties['Nombre']?.title[0]?.text?.content)}
                        key={item.properties['Fecha inicio']?.date?.start || item.id}
                    >
                        {item.properties['Nombre']?.title[0]?.text?.content || "Sin nombre"}
                        {/* Contenido de la página aquí */}
                        {pageContents[item.id] && (
                            <div>
                                {JSON.stringify(pageContents[item.id])}
                            </div>
                        )}
                    </li>
                ))}
        </ul>
    );
};

export default GetNotionData;