import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCookie } from './cookieUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // `null` jako stan pocz¹tkowy
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Funkcja do synchronizacji stanu z ciasteczkami
    const reloadAuthState = () => {
        const token = getCookie('jwtToken');
        const storedUserId = getCookie('userId');
        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        } else {
            setIsLoggedIn(false);
            setUserId(null);
        }
    };

    // Synchronizacja podczas ³adowania komponentu
    useEffect(() => {
        reloadAuthState();
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, isLoading, reloadAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
