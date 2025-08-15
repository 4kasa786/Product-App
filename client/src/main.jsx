import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store, persistor } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// ✅ Import ThemeInit from the generated init file
import { ThemeInit } from '../.flowbite-react/init.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeInit />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
