
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Garantir que o DOM esteja carregado antes de montar
const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Erro crítico: Elemento #root não encontrado no HTML.");
    return;
  }

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
