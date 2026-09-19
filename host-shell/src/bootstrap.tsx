import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HostApp from './HostApp';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Host shell could not find the #root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <HostApp />
  </StrictMode>,
);
