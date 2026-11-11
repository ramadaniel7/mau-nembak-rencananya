import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyPalette } from './utils/theme';
import { config } from './data/config';
import './index.css';

applyPalette();
document.title = config.site.title;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
