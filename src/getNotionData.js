import React, { useEffect, useState } from "react";

const GetNotionData = () => {
    const [notionData, setNotionData] = useState([]);

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

    return (
        <ul>
            {notionData.map((item) => (
                <li key={item.id}>{item.properties.Nombre?.title[0]?.text?.content || "Sin nombre"}</li>
            ))}
        </ul>
    );
};

export default GetNotionData;
