import React, { createContext, useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [getConfetti, setGetConfetti] = useState(false);
  const [nextQuestion, setNextQuestion] = useState(false);

  return (
    <ConfigContext.Provider
      value={{
        getConfetti,
        setGetConfetti,
        nextQuestion,
        setNextQuestion,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
