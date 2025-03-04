import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Groq from "groq-sdk";

const TestNotion = () => {
    const { titulo } = useParams();
    const [pageContent, setPageContent] = useState(null);

    const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true });

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const response = await fetch(`/api/getPageContentByName?pageName=${encodeURIComponent(titulo)}`);
                if (!response.ok) throw new Error("Error al obtener el contenido de la página");
                const data = await response.json();
                setPageContent(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchPageContent();
    }, [titulo]);

    return (
        <div>
            {titulo}
            {pageContent && (
                <div>
                    {JSON.stringify(pageContent)}
                </div>
            )}
        </div>
    );
};

export default TestNotion;