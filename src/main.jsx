import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Подключаем глобальные стили и анимации
import './styles/variables.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
