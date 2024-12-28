import { useState, useEffect } from 'react';
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
        console.log(`Token: ${token}, UserId: ${storedUserId}`);

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
        <div className="login-container">
            <h2 className="login-heading">{isLoggedIn ? 'Twoje Konto' : 'Logowanie'}</h2>

            {/* Błąd walidacji */}
            {error && <p className="error-message">{error}</p>}

            {isLoggedIn ? (
                <div className="logged-in-container">
                    <p className="logged-in-message">Jesteś zalogowany!</p>
                    <button className="logout-button" onClick={handleLogout}>Wyloguj się</button>
                </div>
            ) : (
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Adres e-mail</label>
                        <input
                            className="input-field"
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Wpisz e-mail"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Hasło</label>
                        <input
                            className="input-field"
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Wpisz hasło"
                        />
                    </div>

                    <button className="submit-button" type="submit">Zaloguj się</button>

                    <p className="register-link">
                        Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link>
                    </p>
                </form>
            )}
        </div>
    );
};

export default LoginForm;
