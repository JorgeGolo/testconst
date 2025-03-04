import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const GetNotionData = () => {
    const navigate = useNavigate();
    const [notionData, setNotionData] = useState([]);
    const [subtemaContents, setSubtemaContents] = useState({});

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

    const fetchSubtemaContent = async (pageId, subtemaId) => {
        try {
            const response = await fetch(`/api/notionpage?pageIds=[${subtemaId}]`); //creamos un array de un solo elemento
            if (!response.ok) throw new Error("Error al obtener el contenido del subtema");
            const data = await response.json();
            setSubtemaContents(prev => ({
                ...prev,
                [pageId]: {
                    ...prev[pageId],
                    [subtemaId]: data // Almacena el array de nombres
                }
            }));
        } catch (error) {
            console.error("Error:", error);
        }
    };

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
                        {item.properties['AWS Subtemas']?.relation?.map(subtema => {
                            fetchSubtemaContent(item.id, subtema.id);
                            return (
                                <div id={subtema.id} key={subtema.id}>
                                    {subtemaContents[item.id] && subtemaContents[item.id][subtema.id] && (
                                        <div>
                                            {subtemaContents[item.id][subtema.id].map(name => (
                                                <div key={name}>{name}</div> // Muestra cada nombre
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </li>
                ))}
        </ul>
    );
};

export default GetNotionData;