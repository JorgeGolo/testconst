import React, { createContext, useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [getConfetti, setGetConfetti] = useState(true);
  const [nextQuestion, setNextQuestion] = useState(true);
  const [showBulb, setShowBulb] = useState(true);
  const [showCount, setShowCount] = useState(false);

  // Opciones globales
  const options = [
    { value: "gemini-1.5-flash", label: "gemini-1.5-flash", endpoint: "/api/getData" },
    { value: "opcion2", label: "Opción 2", endpoint: "/api/getOption2Data" },
    { value: "opcion3", label: "Opción 3", endpoint: "/api/getOption3Data" },
  ];

  // Seleccionar la opción inicial por defecto
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <ConfigContext.Provider
      value={{
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
        options, // Pasar opciones para evitar redundancia
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
