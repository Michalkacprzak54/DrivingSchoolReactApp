import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import CenteredSpinner from './components/centeredSpinner';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { isLoggedIn, isLoading, userRole } = useContext(AuthContext);


    if (isLoading) {
        return <CenteredSpinner/>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (requiredRoles && !requiredRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
