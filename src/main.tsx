import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { PostHogProvider } from 'posthog-js/react'

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <PostHogProvider 
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY || ''}
      options={options}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>
);