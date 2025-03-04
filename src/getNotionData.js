import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const GetNotionData = () => {
    const navigate = useNavigate();
    const [notionData, setNotionData] = useState([]);
    const [selectedName, setSelectedName] = useState("");

    const startTitleNotionTest = (title) => {
        navigate(`/notiontest/${title}`, { state: { name: selectedName } }); // Pasa el estado
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
                        onClick={() => {
                            const name = item.properties['Nombre']?.title[0]?.text?.content || "Sin nombre";
                            setSelectedName(name);
                            startTitleNotionTest(name);
                        }}
                        key={item.properties['Fecha inicio']?.date?.start || item.id}
                    >
                        {selectedName ? selectedName : item.properties['Nombre']?.title[0]?.text?.content || "Sin nombre"}
                    </li>
                ))}
        </ul>
    );
};

export default GetNotionData;