import React, { createContext, useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [getConfetti, setGetConfetti] = useState(true);
  const [nextQuestion, setNextQuestion] = useState(true);
  const [showBulb, setShowBulb] = useState(true);
  const [showCount, setShowCount] = useState(false);
  const [selectedOption, setSelectedOption] = useState("opcion1"); // Estado para el select


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
        setSelectedOption, // Agregar el setter del select
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};