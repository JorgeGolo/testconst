import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import Switch from "react-switch";

function Config() {
    
      const [checked, setChecked] = useState(false);


return (
    <div className='configcontent'>
    <ul>
      <li>
        Confetti
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
