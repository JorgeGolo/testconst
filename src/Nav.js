import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    
    return (

      <nav className="nav">
        <Link to="/">Bloque 1</Link>
        <Link to="/config">Configuración</Link>

      </nav>
    );
  };

export default Nav;