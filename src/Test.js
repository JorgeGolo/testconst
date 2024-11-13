// Test.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';
import Nav from './Nav';
import Confetti from 'react-confetti';
import { ConfigContext } from "./ConfigContext";

function Test() {
  const { getConfetti } = useContext(ConfigContext); // Accede al estado global
  const { nextQuestion } = useContext(ConfigContext); // Accede al estado global

  const { titulo } = useParams(); // Accede al parámetro 'titulo' de la URL
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [contenidoseccion, setContenidoSeccion] = useState(null);
  const [contenidocapitulo, setContenidoCapitulo] = useState(null);
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
  }, [titulo]); // Dependiendo de 'titulo', vuelve a cargar los datos

  const obtenerConsultaAleatoria = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/getData?titulo=${encodeURIComponent(titulo)}`);
      const data = await response.json();

      if (response.ok) {
        setCapitulo(data.capitulo);
        setSeccion(data.seccion);
        setArticulo(data.articulo);
        setContenido(data.contenido);
        setContenidoSeccion(data.contenidoseccion);
        setContenidoCapitulo(data.contenidocapitulo);

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

  const handleOptionSelect = (index) => {
    if (showHint) {
      setShowHint(false);
    }

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
      setIsShaking(false);
    } else {
      setShowConfetti(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const renovarPregunta = () => {
    if (nextQuestion) {
      obtenerConsultaAleatoria();
    }
  };

  const handleHintClick = () => {
    setShowHint(!showHint);
  };

  return (
    <div>
      {showConfetti && getConfetti && (
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
            <CircleLoader size={100} color={"#e2e2e2"} loading={loading} />
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
            {capitulo && <p>Capítulo {capitulo}: <span dangerouslySetInnerHTML={{ __html: contenidocapitulo }}/></p>}
            {seccion && <p>Sección {seccion}: <span dangerouslySetInnerHTML={{ __html: contenidoseccion }}/></p>}
            <p>{articulo}</p>
            <div dangerouslySetInnerHTML={{ __html: contenido }} />
          </div>
        )}

        {!nextQuestion &&
          <button>Siguiente</button>
        }

        <div className="subnav">
          <Nav />
        </div>
      </div>
    </div>
  );
}

export default Test;
