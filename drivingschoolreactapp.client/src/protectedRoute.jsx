import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading, reloadAuthState } = useContext(AuthContext);

    useEffect(() => {
        reloadAuthState();
    }, []);

    if (isLoading) {
        return <div>£adowanie...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
