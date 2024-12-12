import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCookie, setCookie, deleteCookie } from './cookieUtils';  

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = getCookie('jwtToken');  
        if (token) {
            setIsLoggedIn(true);
            const userIdFromCookie = getCookie('userId');  
            setUserId(userIdFromCookie);
        }
    }, []);

    const login = (userId) => {
        setCookie('jwtToken', 'your-token');  
        setCookie('userId', userId); 
        setIsLoggedIn(true);
        setUserId(userId);
    };

    const logout = () => {
        deleteCookie('jwtToken');  
        deleteCookie('userId');  
        setIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,  
};
