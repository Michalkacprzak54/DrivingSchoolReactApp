import React, { createContext, useState, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from './cookieUtils';  // Importujemy funkcje z cookieUtils

// Tworzymy kontekst
export const AuthContext = createContext();

// Komponent dostarczaj¹cy kontekst
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    // Sprawdzanie, czy u¿ytkownik jest zalogowany po za³adowaniu strony (np. przez cookie)
    useEffect(() => {
        const token = getCookie('jwtToken');  // Pobieramy token z ciasteczek
        if (token) {
            setIsLoggedIn(true);
            const userIdFromCookie = getCookie('userId');  // Pobieramy userId z ciasteczek
            setUserId(userIdFromCookie);
        }
    }, []);

    const login = (userId) => {
        setCookie('jwtToken', 'your-token');  // Zapisujemy token do ciasteczek
        setCookie('userId', userId);  // Zapisujemy userId do ciasteczek
        setIsLoggedIn(true);
        setUserId(userId);
    };

    const logout = () => {
        deleteCookie('jwtToken');  // Usuwamy token
        deleteCookie('userId');  // Usuwamy userId
        setIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
