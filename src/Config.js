import React, { useContext } from "react";
import Nav from "./Nav";
import Switch from "react-switch";
import { ConfigContext } from "./ConfigContext.js";

function Config() {
  const {
    getConfetti,
    setGetConfetti,
    nextQuestion,
    setNextQuestion,
  } = useContext(ConfigContext);

  return (
    <div className="configcontent">
      <ul>
        <li>
          Confetti {" "}
          <Switch
            onChange={setGetConfetti}
            checked={getConfetti}
            offColor="#888"
            onColor="#007bff"
          />
        </li>
        <li>
          Siguiente pregunta automática {" "}
          <Switch
            onChange={setNextQuestion}
            checked={nextQuestion}
            offColor="#888"
            onColor="#007bff"
          />
        </li>
        <li>Contador de aciertos</li>
      </ul>
      <div className="subnav">
        <Nav />
      </div>
    </div>
  );
}

export default Config;
