import React, { useContext, useState } from "react";
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
          <Switch
            onChange={setGetConfetti}
            checked={getConfetti}
            offColor="#888"
            onColor="#0f0"
          />{" "} Confetti
        </li>
        <li>          
            <Switch
            onChange={setNextQuestion}
            checked={nextQuestion}
            offColor="#888"
            onColor="#0f0"
          />{" "} Siguiente pregunta automática</li>
        <li>Pistas</li>
        <li>Contador de aciertos</li>
      </ul>
      <div className="subnav">
        <Nav />
      </div>
    </div>
  );
}

export default Config;
