import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getCookie } from './cookieUtils'

function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Sprawdzamy, czy w localStorage jest token JWT
        const token = getCookie('jwtToken');
        const storedUserId = getCookie('userId'); 

        // Je�li brak tokenu, przekierowujemy do strony logowania
        if (!token && storedUserId) {
            navigate('/login');  // Przekierowanie do strony logowania
        }
    }, [navigate]);

    // Je�li token istnieje, renderujemy zawarto�� strony
    return children;
}

export default ProtectedRoute;
