import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './utils/sentryFilter';
import './utils/sentryBlock';
import './utils/sentryKiller'; // Importar filtro de Sentry

const root = ReactDOM.createRoot(document.getElementById('root'));

// En desarrollo, deshabilitar StrictMode para evitar doble ejecución
// que puede causar múltiples llamadas a Sentry
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  root.render(<App />);
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

