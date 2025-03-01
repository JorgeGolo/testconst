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

  const startTitleNotionTest = (title) => {
    navigate(`/notiontest/${title}`);
  }

  return (
    <div>
      <div> 
      <h3 className='linktodo'>AWs Certified Partition</h3>
        <ul>
          <li onClick={() => startTitleNotionTest("Título")}>
            Ir
          </li>
        </ul>
      </div> 

      <div>
      <h3 className='linktodo'>Constitución Española  <button onClick={() => startTitleTest("constitucion")}>Todo</button></h3>
      <ul className='ulstyle'> 
        <li onClick={() => startTitleTest("Título Preliminar")}>
          Título Preliminar
        </li>
        <li onClick={() => startTitleTest("Título I")}>
          Título I
        </li>
        <li onClick={() => startTitleTest("Título II")}>
          Título II
        </li>
      </ul>

      <div className="subnav">
        <Nav />
      </div>
      </div>
    </div>
  );
}

export default App;
