import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isLoggedIn, isLoading, userRole } = useContext(AuthContext);


    if (isLoading) {
        return <div>£adowanie...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
