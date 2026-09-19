import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import WatchLogApp from './WatchLogApp';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('WatchLog remote could not find the #root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <WatchLogApp />
    </BrowserRouter>
  </StrictMode>,
);
