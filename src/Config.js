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
      showBulb,
      setShowBulb,
      showCount,
      setShowCount,
    } = useContext(ConfigContext);

  return (
    <div className="configcontent">
      <ul>
        <li>
          <Switch
            onChange={setGetConfetti}
            checked={getConfetti}
            offColor="#888"
            onColor="#007bff"
          />{" "} Confetti
        </li>
        <li>          
          <Switch
            onChange={setNextQuestion}
            checked={nextQuestion}
            offColor="#888"
            onColor="#007bff"
          />{" "} Siguiente pregunta automática</li>
        <li>
          <Switch
            onChange={setShowBulb}
            checked={showBulb}
            offColor="#888"
            onColor="#007bff"
          />{" "} Pistas
        </li>
        <li>
          <Switch
            onChange={setShowCount}
            checked={showCount}
            offColor="#888"
            onColor="#007bff"
          />{" "} Contador de aciertos
        </li>
      </ul>
      <div className="subnav">
        <Nav />
      </div>
    </div>
  );
}

export default Config;
