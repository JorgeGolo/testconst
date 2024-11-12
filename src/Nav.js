import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ setShowTest }) => {
  // Bandera para saber si el test se debe mostrar
  const [testVisible, setTestVisible] = useState(false);

  const handleTestToggle = () => {
    setTestVisible(prev => !prev); // Cambiar el estado de la bandera al hacer clic
    setShowTest(!testVisible); // Pasamos el valor de testVisible a Temas.js
  };

  return (
    <nav className="nav">
      <Link to="/">Inicio</Link>
      <Link to="/temas" onClick={handleTestToggle}>Temas</Link>
    </nav>
  );
};

export default Nav;