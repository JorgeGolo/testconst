import React, { createContext, useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [getConfetti, setGetConfetti] = useState(false);

  return (
    <ConfigContext.Provider value={{ getConfetti, setGetConfetti }}>
      {children}
    </ConfigContext.Provider>
  );
};