import React, { useContext } from "react";
import Nav from "./Nav";
import Switch from "react-switch";
import { ConfigContext } from "./ConfigContext.js";

function Config() {
    const [getConfetti, setGetConfetti] = useState(false);

  return (
    <div className="configcontent">
      <ul>
        <li>
          Confetti{" "}
          <Switch
            onChange={setGetConfetti}
            checked={getConfetti}
            offColor="#888"
            onColor="#0f0"
          />
          <p>{showConfetti ? "On" : "Off"}</p>
        </li>
        <li>Siguiente pregunta automática</li>
        <li>Contador de aciertos</li>
      </ul>
      <div className="subnav">
        <Nav />
      </div>
    </div>
  );
}

export default Config;
