import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    
    return (

      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/temas">Temas</Link>
        <Link to="/config">Configuración</Link>

      </nav>
    );
  };

export default Nav;