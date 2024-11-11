import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Confetti from 'react-confetti';
import './App.css'; // Importa un archivo CSS para el efecto shake

function App() {
  const [titulo, setTitulo] = useState(null);
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [contenido, setContenido] = useState(null);
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShaking, setIsShaking] = useState(false); // Estado para activar el efecto shake
  const [showHint, setShowHint] = useState(false); // Estado para mostrar/ocultar el hint

  useEffect(() => {
    obtenerConsultaAleatoria();
  }, []);

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

  const handleOptionSelect = (index) => {
    if (index === respuestaCorrecta) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        renovarPregunta(); // Renovar la pregunta después de mostrar el confeti
      }, 1500);
      setIsShaking(false); // Detener el efecto shake si es correcto
    } else {
      setShowConfetti(false);
      setIsShaking(true); // Activar el efecto shake si es incorrecto
      setTimeout(() => setIsShaking(false), 500); // Detener el efecto shake después de un tiempo
    }
  };

  const renovarPregunta = () => {
    obtenerConsultaAleatoria(); // Llamamos a la función para obtener una nueva pregunta
  };

  return (
    <div className='test'>
      <Nav />
      {showConfetti && 
        <Confetti
          gravity={1.5}
          numberOfPieces={500}
          recycle={false}
          initialVelocityY={10}
          wind={0.02}
        />
      }

      {pregunta && (
        <div className={`pregunta-container ${isShaking ? 'shake' : ''}`}>
          <p>
            <strong>{pregunta}</strong>
            <span 
              className='hinticon' 
              onClick={() => setShowHint(!showHint)} // Alterna la visibilidad del hint
              style={{ cursor: 'pointer', marginLeft: '8px' }}
            >
              🛈 Pista
            </span>
          </p>
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
      {showHint && ( // Solo muestra el hint si showHint es true
        <div className='hint'>
          {titulo && <p>{titulo}</p>}
          {capitulo && <p>Capítulo {capitulo}</p>}
          {seccion && <p>Sección {seccion}</p>}
          <p>{articulo}</p>
          <div dangerouslySetInnerHTML={{ __html: contenido }} />
        </div>
      )}
    </div>
  );
}

export default App;
