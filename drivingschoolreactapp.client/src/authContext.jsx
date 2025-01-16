import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCookie } from './utils/cookieUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // `null` jako stan pocz¹tkowy
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null); // Dodajemy userRole
    const [isLoading, setIsLoading] = useState(true);

    const reloadAuthState = () => {
        const tokenUser = getCookie('jwtToken');
        const tokenInstructor = getCookie('jwtTokenInstructor');
        const storedUserId = getCookie('userId');
        const storedInstructorId = getCookie('instructorId');
        const storedRole = getCookie('role');

        // Sprawdzamy, czy istnieje token u¿ytkownika lub token instruktora
        if ((tokenUser && storedRole === 'client') || (tokenInstructor && storedRole === 'instructor')) {
            setIsLoggedIn(true);
            setUserRole(storedRole); // Ustawiamy rolê na podstawie ciasteczka

            // Ustawiamy userId w zale¿noœci od roli
            if (storedRole === 'client') {
                setUserId(storedUserId); // Ustawiamy userId dla klienta
            } else if (storedRole === 'instructor') {
                setUserId(storedInstructorId); // Ustawiamy userId dla instruktora
            } else {
                console.error('Nieznana rola:', storedRole);
                setIsLoggedIn(false);
                setUserId(null);
                setUserRole(null);
            }
        } else {
            // Jeœli nie znaleziono tokenów, ustawiamy stan na niezalogowany
            setIsLoggedIn(false);
            setUserId(null);
            setUserRole(null); // Brak roli
        }
    };

    // Synchronizacja podczas ³adowania komponentu
    useEffect(() => {
        reloadAuthState();
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, userRole, isLoading, reloadAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
