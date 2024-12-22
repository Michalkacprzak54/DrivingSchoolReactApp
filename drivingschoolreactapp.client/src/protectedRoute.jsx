import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>£adowanie...</div>; // Mo¿esz tu wstawiæ spinner lub wskaŸnik ³adowania
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
