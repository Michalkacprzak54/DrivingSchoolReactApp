import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Sprawdzamy, czy w localStorage jest token JWT
        const token = localStorage.getItem('jwtToken');

        // Je�li brak tokenu, przekierowujemy do strony logowania
        if (!token) {
            navigate('/login');  // Przekierowanie do strony logowania
        }
    }, [navigate]);

    // Je�li token istnieje, renderujemy zawarto�� strony
    return children;
}

export default ProtectedRoute;
