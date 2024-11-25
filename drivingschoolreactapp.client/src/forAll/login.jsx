import React, { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    // Stany dla pól formularza i błędu
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Funkcja do pobierania wartości ciasteczka
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    useEffect(() => {
        // Sprawdź, czy token istnieje w ciasteczku przy załadowaniu komponentu
        const token = getCookie('jwtToken');
        console.log('Token:', token);
        if (token) setIsLoggedIn(true);
    }, []);

    // Funkcje obsługujące zmiany w polach formularza
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    // Funkcja obsługująca wysyłanie formularza
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

                // Ustawienie ciasteczka z tokenem
                document.cookie = `jwtToken=${token}; path=/; secure;`;

                setIsLoggedIn(true);
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

    // Funkcja obsługująca wylogowanie
    const handleLogout = () => {
        // Usuń ciasteczko z tokenem
        document.cookie = 'jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

        setIsLoggedIn(false); // Ustawienie stanu na niezalogowany
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
