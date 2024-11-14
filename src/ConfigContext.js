import React, { createContext, useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [getConfetti, setGetConfetti] = useState(true);
  const [nextQuestion, setNextQuestion] = useState(true);
  const [showBulb, setShowBulb] = useState(true);
  const [showCount, setShowCount] = useState(false);

  return (
    <ConfigContext.Provider value={{ getConfetti, setGetConfetti, nextQuestion, setNextQuestion, showBulb, setShowBulb, showCount, setShowCount}}>
      {children}
    </ConfigContext.Provider>
  );
};