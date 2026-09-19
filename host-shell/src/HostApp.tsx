import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RemoteLoadError } from './RemoteLoadError';

const WatchLogApp = lazy(() => import('watchlog/WatchLogApp'));

export default function HostApp() {
  return (
    <BrowserRouter>
      <header
        style={{
          padding: '8px 16px',
          background: '#111827',
          color: '#f9fafb',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 14,
        }}
      >
        Host shell · WatchLog is loaded from http://localhost:3001/remoteEntry.js
      </header>
      <RemoteLoadError>
        <Suspense fallback={<p>Loading WatchLog…</p>}>
          <WatchLogApp />
        </Suspense>
      </RemoteLoadError>
    </BrowserRouter>
  );
}
