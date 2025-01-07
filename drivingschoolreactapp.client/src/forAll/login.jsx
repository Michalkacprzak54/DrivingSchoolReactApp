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

                setCookie('jwtToken', token);
                setCookie('userId', userId);

                setIsLoggedIn(true);
                setUserId(userId);
                alert('Zalogowano pomyślnie!');
                window.location.reload();

                setEmail('');
                setPassword('');
                setError('');
            } else {
                setError('Nie udało się zalogować. Brak tokenu.');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas logowania.');
        }
    };

    const handleLogout = () => {
        deleteCookie('jwtToken');
        deleteCookie('userId');
        clearCart();
        setIsLoggedIn(false);
        setUserId(null);
        alert('Wylogowano pomyślnie!');
    };

    return (
        <div className="div-form">
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">
                        {isLoggedIn ? 'Twoje Konto' : 'Logowanie'}
                    </h2>

                    {error && (
                        <div className="alert alert-danger text-center" role="alert">
                            {error}
                        </div>
                    )}

                    {isLoggedIn ? (
                        <div className="text-center">
                            <p className="mb-4">Jesteś zalogowany!</p>
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleLogout}
                            >
                                Wyloguj się
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Adres e-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Wpisz e-mail"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Hasło
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Wpisz hasło"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Zaloguj się
                            </button>

                            <div className="text-center mt-3">
                                <p>
                                    Nie masz jeszcze konta?{' '}
                                    <Link to="/register" className="text-decoration-none">
                                        Zarejestruj się
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default LoginForm;
