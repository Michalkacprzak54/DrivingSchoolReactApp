import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './AuthContext'; // Importujemy AuthProvider

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>  {/* Opakowujemy App w AuthProvider */}
            <App />
        </AuthProvider>
    </StrictMode>
);
