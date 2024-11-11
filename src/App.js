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
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [moveUp, setMoveUp] = useState(false); // Estado para mover el div hacia arriba
  const [reaparecer, setReaparecer] = useState(false); // Estado para reaparecer el div

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

        const lines = data.respuestaIA.split('\n').filter(line => line.trim() !== '');
        setPregunta(lines[0]);
        setOpciones(lines.slice(1, 5));
        setRespuestaCorrecta(parseInt(lines[5]) - 1);
        
        // Después de haber recibido la nueva pregunta, mostramos el div
        setReaparecer(true);
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
        
        // Aquí activamos el movimiento del div hacia arriba antes de recargar la pregunta
        setMoveUp(true);

        // Después de que se haya ocultado el div, recargamos la pregunta
        setTimeout(() => {
          obtenerConsultaAleatoria(); // Recargar la nueva pregunta
          setMoveUp(false); // Al final, el div vuelve a aparecer
        }, 1500); // 1500ms es la duración de la animación
      }, 1500);
      setIsShaking(false);
    } else {
      setShowConfetti(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className={`test ${moveUp ? 'move-up' : ''} ${reaparecer ? 'reaparecer' : ''}`}>
      <Nav />
      {showConfetti && (
        <Confetti
          gravity={1.5}
          numberOfPieces={500}
          recycle={false}
          initialVelocityY={10}
          wind={0.02}
        />
      )}
      {pregunta && (
        <div className={`pregunta-container ${isShaking ? 'shake' : ''}`}>
          <p>
            <strong>{pregunta}</strong>
            <span
              className='hinticon'
              onClick={() => setShowHint(!showHint)}
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
      {showHint && (
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
