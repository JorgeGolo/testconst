import React, { useEffect, useState } from "react";

const GetNotionData = () => {
    const [notionData, setNotionData] = useState([]);

    useEffect(() => {
        const fetchNotionData = async () => {
            try {
                const response = await fetch(`https://api.notion.com/v1/databases/${process.env.REACT_APP_NOTION_DATABASE_ID}/query`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.REACT_APP_NOTION_API_KEY}`,
                        "Content-Type": "application/json",
                        "Notion-Version": "2022-06-28",
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los datos de Notion");
                }

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
