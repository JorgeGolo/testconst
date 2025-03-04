import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const GetNotionData = () => {
    const navigate = useNavigate();


    const [notionData, setNotionData] = useState([]);
    const startTitleNotionTest = (title) => {
        navigate(`/notiontest/${title}`);
      }
 
    useEffect(() => {
        const fetchNotionData = async () => {
            try {
                const response = await fetch("/api/notion"); // Llama a tu backend en Vercel
                if (!response.ok) throw new Error("Error al obtener datos");
                const data = await response.json();
                setNotionData(data.results);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchNotionData();
    }, []);

    // debe tener un camp "Nombre"
    // la integración de esto puede mejorar, pero así vale de momento, sirve al propósito
    // (porque estamso pasando el nombre del campo "Nombre", y podríamos obtenerlo o no necesitarlo)
    // (incluso podríamos obtener más info del espacio de trabajo para crear un script más eficiente y global de conexión 
    // con bases de datos de Notion)

    return (
        <ul>
        {notionData
            .slice() // Crea una copia del array para no modificar el original
            .sort((a, b) => {
            const fechaA = a.properties['Fecha inicio']?.date?.start;
            const fechaB = b.properties['Fecha inicio']?.date?.start;

            if (!fechaA) return 1; // Si fechaA no existe, coloca b antes
            if (!fechaB) return -1; // Si fechaB no existe, coloca a antes

            return new Date(fechaA) - new Date(fechaB); // Compara las fechas
            })
            .map((item) => (
            <li
                onClick={() => startTitleNotionTest(item.properties['Nombre']?.title[0]?.text?.content)}
                key={item.properties['Fecha inicio']?.date?.start || item.id}
            >
                {item.properties['Nombre']?.title[0]?.text?.content || "Sin nombre"} - 
                {item.properties['AWS Subtemas']?.title[0]?.text?.content}
                {/* contenido de la pagina aqui*/}
            </li>
            ))}
        </ul>
    );
};

export default GetNotionData;
