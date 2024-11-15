import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import './App.css';

function App() {
  const navigate = useNavigate();

  const startTitleTest = (title) => {
    // Navegar a la ruta que muestra el test correspondiente
    navigate(`/test/${title}`);
  };

  return (
    <div>
      <h3>Constitución Española  <button onClick={() => startTitleTest("constitucion")}>Test</button></h3>
      <ul className='ulstyle'> 
        <li>Preámbulo</li>
        <li>
          Título Preliminar -
          <button onClick={() => startTitleTest("Título Preliminar")}>Test</button>
        </li>
        <li>
          Título I - <button onClick={() => startTitleTest("Título I")}>Test</button>
        </li>
        <li>
          Título II - <button onClick={() => startTitleTest("Título II")}>Test</button>
        </li>
      </ul>

      <div className="subnav">
        <Nav />
      </div>
    </div>
  );
}

export default App;
