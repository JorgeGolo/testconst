import React, { useContext } from "react";
import Nav from "./Nav";
import Switch from "react-switch";
import Select from "react-select"; // Usando react-select
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
    selectedOption,
    setSelectedOption,
    options, // Obtener opciones desde el contexto
  } = useContext(ConfigContext);

  const handleSelectChange = (selectedOption) => {
    console.log("Valor seleccionado:", selectedOption.value);
    setSelectedOption(selectedOption); // Actualizar el contexto con el objeto seleccionado
  };

  return (
    <div className="configcontent">
      <ul>
        <li>
          <Switch
            onChange={setGetConfetti}
            checked={getConfetti}
            offColor="#888"
            onColor="#007bff"
          />{" "}
          Confetti
        </li>
        <li>
          <Switch
            onChange={setNextQuestion}
            checked={nextQuestion}
            offColor="#888"
            onColor="#007bff"
          />{" "}
          Siguiente pregunta automática
        </li>
        <li>
          <Switch
            onChange={setShowBulb}
            checked={showBulb}
            offColor="#888"
            onColor="#007bff"
          />{" "}
          Pistas
        </li>
        <li>
          <Switch
            onChange={setShowCount}
            checked={showCount}
            offColor="#888"
            onColor="#007bff"
          />{" "}
          Contador de aciertos
        </li>
        <li>
          <Select
            options={options}
            value={selectedOption} // Mostrar el valor actual
            onChange={handleSelectChange} // Cambiar valor al seleccionar
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#f5f5f5",
                borderColor: "#007bff",
                color: "#333",
                width: "200px",
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused ? "#007bff" : "white",
                color: isFocused ? "white" : "black",
              }),
            }}
          />
        </li>
      </ul>
      <div className="subnav">
        <Nav />
      </div>
    </div>
  );
}

export default Config;
