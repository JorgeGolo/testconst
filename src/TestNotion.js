import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Groq from "groq-sdk";

const TestNotion = () => {
    const { titulo } = useParams();
    const location = useLocation();
    const selectedName = location.state?.name; // Accede al estado

    const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true });

    return (
        <div>
            {titulo} - {selectedName}
        </div>
    );
};

export default TestNotion;