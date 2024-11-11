import React, { useEffect, useState } from 'react';
import Nav from './Nav';

const Temas = () => {


  const startTitleTest = (title) => {
    console.log(title);
  };

  return (
    <div>
      <h2>Temas</h2>
      <div>
        <ul>
          <li>Preámbulo</li>
          <li>Título Preliminar - <button onClick={() => startTitleTest("Título Preliminar")}>Test</button></li>
          <li>Título I</li>
          <li>Título II</li>
        </ul> 
      </div>
      <div className="subnav">
        <Nav />
      </div>
    </div>
  );
};

export default Temas;
