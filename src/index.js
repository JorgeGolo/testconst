import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Temas from './Temas';
import Test from './Test';
import TestNotion from './TestNotion';

import Config from './Config';
import { ConfigProvider } from "./ConfigContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider>

    <Router>
      <Routes>

          <Route path="/" element={<App />} />
          <Route path="/temas" element={<Temas />} />
          <Route path="/test/:titulo" element={<Test />} />
          <Route path="/config" element={<Config />} />
          <Route path="/notiontest/:titulo" element={<TestNotion />} />

      </Routes>
    </Router>
  </ConfigProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
