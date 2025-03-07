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
  const { showBulb } = useContext(ConfigContext); // Accede al estado global
  const { showCount } = useContext(ConfigContext); // Accede al estado global
  const { selectedOption } = useContext(ConfigContext); // Accede al estado global


  const { titulo } = useParams(); // Accede al parámetro 'titulo' de la URL
  const [capitulo, setCapitulo] = useState(null);
  const [seccion, setSeccion] = useState(null);
  const [contenidoseccion, setContenidoSeccion] = useState(null);
  const [contenidocapitulo, setContenidoCapitulo] = useState(null);
  const [contenidotitulo, setContenidoTitulo] = useState(null);
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
  const [selectedIndex, setSelectedIndex] = useState(null);

  
  useEffect(() => {
    obtenerConsultaAleatoria();
  }, [titulo]); // Dependiendo de 'titulo', vuelve a cargar los datos

  const obtenerConsultaAleatoria = async () => {
    try {
      setLoading(true);
      
      // Usa el endpoint de la opción seleccionada
      const endpoint = selectedOption.endpoint; 

      // llama  al endpoint
      // endpoint viene de const { selectedOption } = useContext(ConfigContext); // Accede al estado global
      // y puede tomar este valor 
      //     { value: "gemini-1.5-flash", label: "gemini-1.5-flash", endpoint: "/api/getData" },
      const response = await fetch(`${endpoint}?titulo=${encodeURIComponent(titulo)}`);

      // convierte info
      const data = await response.json();

      // maneja respuesta
      if (response.ok) {
        setCapitulo(data.capitulo);
        setSeccion(data.seccion);
        setArticulo(data.articulo);
        setContenido(data.contenido);
        setContenidoSeccion(data.contenidoseccion);
        setContenidoCapitulo(data.contenidocapitulo);
        setContenidoTitulo(data.contenidotitulo);

        const lines = data.respuestaIA.split('\n').filter(line => line.trim() !== '');
        setPregunta(lines[0]);
        setOpciones(lines.slice(1, 5));
        setRespuestaCorrecta(parseInt(lines[5]) - 1);
      } else {
        console.error('Error 1 al obtener los datos:', data.error);
      }
    } catch (error) {
      console.error('Error 2 al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index) => {
    setSelectedIndex(index); // Guarda el índice seleccionado
    setShowHint(false);

    if (index === respuestaCorrecta) {
      setShowConfetti(true);
      
      if (nextQuestion) {
        moversePregunta();
      }
      setIsShaking(false);
    } else {
      setShowConfetti(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const moversePregunta = () => {
    setShowHint(false);
    setTimeout(() => {
      setShowConfetti(false);
      setMoveUp(true);
      setTimeout(() => {
        obtenerConsultaAleatoria();
        setMoveUp(false);
        setSelectedIndex(null); // Resetea el índice seleccionado
      }, 1500);
    }, 1500);

  }

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
                {showBulb && (<span
                  className="hinticon"
                  onClick={handleHintClick}
                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                >
                  💡 Pista
                </span>
                )}
              </p>
              <div className="opciones-container">
                {opciones.map((opcion, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`opcion ${selectedIndex === index && index === respuestaCorrecta ? 'correcto' : ''}`}
                  >
                    {opcion}
                  </div>
                ))}
              </div>

              {!nextQuestion && !loading && (
                <button
                  className="botonsiguiente"
                  onClick={() => moversePregunta()}
                  disabled={selectedIndex === null || selectedIndex !== respuestaCorrecta} // Deshabilitar hasta que se marque la respuesta correcta
                >
                  Siguiente
                </button>
              )}

            </div>
          )
        )}
        {showHint && (
          <div className="hint show"> 
            {titulo && <p>{titulo}: <span dangerouslySetInnerHTML={{ __html: contenidotitulo }} /></p>}
            {capitulo && (
              <p>
                Capítulo {capitulo}: <span dangerouslySetInnerHTML={{ __html: contenidocapitulo }} />
              </p>
            )}
            {seccion && (
              <p>
                Sección {seccion}: <span dangerouslySetInnerHTML={{ __html: contenidoseccion }} />
              </p>
            )}
            <p>{articulo}</p>
            <div dangerouslySetInnerHTML={{ __html: contenido }} />
          </div>
        )}

        {showCount && (
          <div className='contadordiv'>Contador</div>
        )}

        <div className="subnav">
          <Nav />
        </div>

      </div>
    </div>
  );
}

export default Test;
