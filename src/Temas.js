import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';
import Confetti from 'react-confetti';
import { CircleLoader } from 'react-spinners';

function Temas({ testVisible, setShowTest }) {
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
  const location = useLocation();

  const startTitleTest = async (title) => {
    console.log("Título:", title);
    try {
      setLoading(true);
      setShowTest(true); // Muestra el test al seleccionar un tema
      const response = await fetch(`/api/getData?titulo=${encodeURIComponent(title)}`);
      const data = await response.json();

      if (response.ok) {
        setTitulo(data.titulo);
        setCapitulo(data.capitulo);
        setSeccion(data.seccion);
        setArticulo(data.articulo);
        setContenido(data.contenido);

        const lines = data.respuestaIA.split('\n').filter(line => line.trim() !== '');
        setPregunta(lines[0]);
        const opciones = lines.slice(1, 5);
        setOpciones(opciones);

        const respuestaCorrecta = parseInt(lines[5]) - 1;
        setRespuestaCorrecta(respuestaCorrecta);
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
    if (index === respuestaCorrecta) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setMoveUp(true);
        setTimeout(() => {
          renovarPregunta(); // Solicita una nueva pregunta para el mismo título
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
    if (titulo) {
      startTitleTest(titulo); // Usa el título actual para renovar la pregunta
    }
  };

  const handleHintClick = () => {
    setShowHint(!showHint); // Alternar la visibilidad de la pista
  };

  return (
    <div>
      {!testVisible && (
        <div>
          <ul>
            <li>Preámbulo</li>
            <li>Título Preliminar - <button onClick={() => startTitleTest("Título Preliminar")}>Test</button></li>
            <li>Título I - <button onClick={() => startTitleTest("Título I")}>Test</button></li>
            <li>Título II - <button onClick={() => startTitleTest("Título II")}>Test</button></li>
          </ul>
        </div>
      )}

      {showConfetti && (
        <Confetti gravity={1.5} numberOfPieces={500} recycle={false} initialVelocityY={10} wind={0.02} />
      )}

      {testVisible && (
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
              {capitulo && <p>Capítulo {capitulo}</p>}
              {seccion && <p>Sección {seccion}</p>}
              <p>{articulo}</p>
              <div dangerouslySetInnerHTML={{ __html: contenido }} />
            </div>
          )}
        </div>
      )}

      <div className="subnav">
        <Nav setShowTest={setShowTest} />
      </div>
    </div>
  );
}

export default Temas;
