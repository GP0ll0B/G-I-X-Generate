import React from 'react';
import ReactDOM from 'react-dom/client';
import { FacebookProvider } from './hooks/useFacebook';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FacebookProvider>
      <App />
    </FacebookProvider>
  </React.StrictMode>
);
