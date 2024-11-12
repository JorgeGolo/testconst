import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Confetti from 'react-confetti';
import { CircleLoader } from 'react-spinners'; // Importa el spinner
import './App.css';

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
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerConsultaAleatoria();
  }, []);

  const obtenerConsultaAleatoria = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getData');
      const data = await response.json();

      if (response.ok) {
        setTitulo(data.titulo);
        setCapitulo(data.capitulo);
        setSeccion(data.seccion);
        setArticulo(data.articulo);
        setContenido(data.contenido);

        const respuestaIA = JSON.parse(data.respuestaIA); // Aseguramos que sea JSON válido
        setPregunta(respuestaIA.question);
        setOpciones(respuestaIA.options);
        setRespuestaCorrecta(respuestaIA.correctAnswer - 1); // Ajustamos índice a 0-based
      } else {
        console.error('Error al obtener los datos:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index) => {
    if (showHint) setShowHint(false);

    if (index === respuestaCorrecta) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setMoveUp(true);
        setTimeout(() => {
          renovarPregunta();
          setMoveUp(false);
        }, 1500);
      }, 1500);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const renovarPregunta = () => {
    obtenerConsultaAleatoria();
  };

  const handleHintClick = () => {
    setShowHint(!showHint); // Alternar la visibilidad de la pista
  };

  return (
    <div>
      {showConfetti && (
        <Confetti
          gravity={1.5}
          numberOfPieces={500}
          recycle={false}
          initialVelocityY={10}
          wind={0.02}
        />
      )}
      <div className={`test ${moveUp ? 'move-up' : ''}`}>
        {loading ? (
          <div className="loading-container">
            <CircleLoader size={100} color="#e2e2e2" loading={loading} />
          </div>
        ) : (
          pregunta && (
            <div className={`pregunta-container ${isShaking ? 'shake' : ''}`}>
              <p>
                <strong>{pregunta}</strong>
                <span
                  className="hinticon"
                  onClick={handleHintClick}
                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                >
                  💡 Pista
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
          )
        )}

        {showHint && (
          <div className="hint show">
            {titulo && <p>{titulo}</p>}
            {capitulo && <p>Capítulo {capitulo}</p>}
            {seccion && <p>Sección {seccion}</p>}
            <p>{articulo}</p>
            {contenido && (
              <div dangerouslySetInnerHTML={{ __html: contenido }} />
            )}
          </div>
        )}

        <div className="subnav">
          <Nav />
        </div>
      </div>
    </div>
  );
}

export default App;
