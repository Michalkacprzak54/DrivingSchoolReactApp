import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCookie } from './cookieUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // `null` jako stan pocz¹tkowy
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null); // Dodajemy userRole
    const [isLoading, setIsLoading] = useState(true);

    // Funkcja do synchronizacji stanu z ciasteczkami
    const reloadAuthState = () => {
        const token = getCookie('jwtToken');
        const storedUserId = getCookie('userId');
        const storedInstructorId = getCookie('instructorId');

        if (token) {
            if (storedUserId) {
                setIsLoggedIn(true);
                setUserId(storedUserId);
                setUserRole('client'); // Ustawiamy rolê klienta
            } else if (storedInstructorId) {
                setIsLoggedIn(true);
                setUserId(storedInstructorId);
                setUserRole('instructor'); // Ustawiamy rolê instruktora
            } else {
                setIsLoggedIn(false);
                setUserId(null);
                setUserRole(null); // Brak roli
            }
        } else {
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
