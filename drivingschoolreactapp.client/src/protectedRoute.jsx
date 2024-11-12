import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Sprawdzamy, czy w localStorage jest token JWT
        const token = localStorage.getItem('jwtToken');

        // Jeœli brak tokenu, przekierowujemy do strony logowania
        if (!token) {
            navigate('/login');  // Przekierowanie do strony logowania
        }
    }, [navigate]);

    // Jeœli token istnieje, renderujemy zawartoœæ strony
    return children;
}

export default ProtectedRoute;
