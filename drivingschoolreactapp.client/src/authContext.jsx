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
        const tokenAdmin = getCookie('jwtTokenAdmin');

        const storedUserId = getCookie('userId');
        const storedInstructorId = getCookie('instructorId');
        const storedAdminId = getCookie('adminId'); 

        const storedRole = getCookie('role');


        if (
            (tokenUser && storedRole === 'client') ||
            (tokenInstructor && storedRole === 'instructor') ||
            (tokenAdmin && storedRole === 'admin')
        ) {
            setIsLoggedIn(true);
            setUserRole(storedRole); 

            if (storedRole === 'client') {
                setUserId(storedUserId); 
            } else if (storedRole === 'instructor') {
                setUserId(storedInstructorId); 
            } else if (storedRole === 'admin') {
                setUserId(storedAdminId); 
            } else {
                console.error('Nieznana rola:', storedRole);
                setIsLoggedIn(false);
                setUserId(null);
                setUserRole(null);
            }
        } else {
            setIsLoggedIn(false);
            setUserId(null);
            setUserRole(null); 
        }
    };

    
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
