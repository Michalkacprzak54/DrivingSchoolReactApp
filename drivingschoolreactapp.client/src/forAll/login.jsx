import React, { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { Link } from 'react-router-dom';
import { getCookie, setCookie, deleteCookie } from '../cookieUtils';
import { clearCart } from './cart/cartUtils';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    // Sprawdzenie, czy użytkownik jest już zalogowany
    useEffect(() => {
        const token = getCookie('jwtToken');
        const storedUserId = getCookie('userId');

        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        }
    }, []);

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Proszę wypełnić oba pola.');
            return;
        }

        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT_LOGIN).login({
                email,
                password,
            });

            if (response.data.token) {
                const token = response.data.token;
                const userId = response.data.userId;

                // Ustawienie ciasteczek
                setCookie('jwtToken', token);
                setCookie('userId', userId);

                setIsLoggedIn(true);
                setUserId(userId);
                alert('Zalogowano pomyślnie!');
                setEmail('');
                setPassword('');
                setError('');
            } else {
                setError('Nie udało się zalogować. Brak tokenu.');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setError('Wystąpił błąd podczas logowania.');
        }
    };

    const handleLogout = () => {
        // Usuwanie ciasteczek
        deleteCookie('jwtToken');
        deleteCookie('userId');

        //czyszczenie koszyka w localStorage
        clearCart();

        setIsLoggedIn(false);
        setUserId(null);
        alert('Wylogowano pomyślnie!');
    };

    return (
        <div>
            <h2>{isLoggedIn ? 'Twoje Konto' : 'Logowanie'}</h2>

            {/* Błąd walidacji */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {isLoggedIn ? (
                <div>
                    <p>Jesteś zalogowany!</p>
                    <button onClick={handleLogout}>Wyloguj się</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Adres e-mail</label>
                        <br />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Wpisz e-mail"
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Hasło</label>
                        <br />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Wpisz hasło"
                        />
                    </div>

                    <button type="submit">Zaloguj się</button>

                    <p style={{ marginTop: '10px' }}>
                        Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link>
                    </p>
                </form>
            )}
        </div>
    );
};

export default LoginForm;
