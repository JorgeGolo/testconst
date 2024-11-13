import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import Switch from "react-switch";

function Config() {
    
    const [checkedc, setCheckedc] = useState(false);


return (
    <div className='configcontent'>
    <ul>
      <li>
        Confetti  <Switch 
        onChange={setCheckedc} 
        checked={checkedc} 
        offColor="#888" 
        onColor="#0f0" 
      />
      <p>{checked ? "On" : "Off"}</p>
      </li>
      <li>
        Siguiente pregunta automática
      </li>
      <li>
        Contador de aciertos
      </li>
    </ul>
    <div className="subnav">
        <Nav />
    </div>
    </div>
);


}

export default Config;
