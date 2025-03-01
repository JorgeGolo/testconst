import React from 'react';
import { useParams } from 'react-router-dom';

const TestNotion = () => {

  const { titulo } = useParams(); // Accede al parámetro 'titulo' de la URL


    return (
        <div>
            {titulo}
        </div>
    );
};

export default TestNotion;