import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Confetti from 'react-confetti';

function App() {
  const [titulo, setTitulo] = useState(null);
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [contenido, setContenido] = useState(null);
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const obtenerConsultaAleatoria = async () => {
      try {
        const response = await fetch('/api/getData');
        const data = await response.json();

        if (response.ok) {
          setTitulo(data.titulo);
          setCapitulo(data.capitulo);
          setSeccion(data.seccion);
          setArticulo(data.articulo);
          setContenido(data.contenido);

          // Procesar respuesta de OpenAI
          const lines = data.respuestaIA.split('\n').filter(line => line.trim() !== '');
          setPregunta(lines[0]);
          setOpciones(lines.slice(1, 5));
          setRespuestaCorrecta(parseInt(lines[5]) - 1);

        } else {
          console.error('Error al obtener los datos:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerConsultaAleatoria();
  }, []);

  const handleOptionSelect = (index) => {
    if (index === respuestaCorrecta) {
      setMensaje('Respuesta correcta');
      setShowConfetti(true); // Activa el confeti cuando la respuesta es correcta
      setTimeout(() => setShowConfetti(false), 1500); // Desactiva el confeti después de 3 segundos
    } else {
      setMensaje('Respuesta incorrecta');
      setShowConfetti(false);
    }
  };

  return (
    <div>
      <Nav/>
      {showConfetti && 
              <Confetti
              gravity={1.5}  // Aumenta la velocidad de caída
              numberOfPieces={500} // Incrementa el número de piezas
              recycle={false}  // No recicle las piezas, para que desaparezcan
              initialVelocityY={10} // Configura la velocidad inicial desde abajo hacia arriba
              wind={0.02}  // Da un ligero movimiento hacia los lados
              run={showConfetti}
            />
      }
      <p>
        {mensaje === 'Respuesta correcta' ? (
          <span style={{ color: 'green' }}>{mensaje}</span>
        ) : mensaje === 'Respuesta incorrecta' ? (
          <span style={{ color: 'red' }}>{mensaje}</span>
        ) : null}
      </p>
      <hr/>
      {titulo && <p>{titulo}</p>}
      {capitulo && <p>Capítulo {capitulo}</p>}
      {seccion && <p>Sección {seccion}</p>}
      <p>{articulo}</p>
      <div dangerouslySetInnerHTML={{ __html: contenido }} />

      {pregunta && (
        <div>
          <p><strong>{pregunta}</strong></p>
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

export default App;
