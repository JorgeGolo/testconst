import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';

function Test() {
  const { titulo } = useParams(); // Obtener el parámetro 'titulo' de la URL
  const [loading, setLoading] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getData?titulo=${encodeURIComponent(titulo)}`);
        const data = await response.json();
        if (response.ok) {
          const lines = data.respuestaIA.split('\n').filter(line => line.trim() !== '');
          setPregunta(lines[0]);
          setOpciones(lines.slice(1, 5));
          setRespuestaCorrecta(parseInt(lines[5]) - 1);
        } else {
          console.error('Error al obtener los datos:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [titulo]);

  const handleOptionSelect = (index) => {
    if (index === respuestaCorrecta) {
      alert('Respuesta correcta!');
    } else {
      alert('Respuesta incorrecta!');
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <CircleLoader size={100} color={"#e2e2e2"} loading={loading} />
        </div>
      ) : (
        <div>
          <h2>{titulo}</h2>
          <p>{pregunta}</p>
          <form>
            {opciones.map((opcion, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`opcion${index}`}
                  name="respuesta"
                  onClick={() => handleOptionSelect(index)}
                />
                <label htmlFor={`opcion${index}`}>{opcion}</label>
              </div>
            ))}
          </form>
        </div>
      )}
    </div>
  );
}

export default Test;
