import React, { createContext, useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [getConfetti, setGetConfetti] = useState(true);
  const [nextQuestion, setNextQuestion] = useState(true);
  const [showBulb, SetShowBulb] = useState(true);

  return (
    <ConfigContext.Provider value={{ getConfetti, setGetConfetti, nextQuestion, setNextQuestion, showBulb, SetShowBulb}}>
      {children}
    </ConfigContext.Provider>
  );
};