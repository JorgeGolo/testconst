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
                        
                        <ul>
                            {item.properties['AWS Subtemas']?.relation?.map(subtema => (
                                <li key={subtema.id}>
                                    {/* Aquí puedes obtener y mostrar los datos de la página relacionada */}
                                    {subtema.id}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
        </ul>
    );
};

export default GetNotionData;