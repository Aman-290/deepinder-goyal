import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SmoothScrollProvider from './providers/SmoothScrollProvider';
import App from './App.tsx';
import 'lenis/dist/lenis.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>,
);
