import React from 'react';
import { useParams } from 'react-router-dom';
import Groq from "groq-sdk";

const TestNotion = () => {

  const { titulo } = useParams(); // Accede al parámetro 'titulo' de la URL

  const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY });
      
    return (
        <div>
            {titulo}
        </div>
    );
};

export default TestNotion;