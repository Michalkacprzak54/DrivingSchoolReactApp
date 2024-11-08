import React, { useState, useEffect } from 'react';

const LoginForm = () => {
    // Stany dla pól formularza i błędu
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Sprawdź, czy token istnieje w localStorage przy załadowaniu komponentu
        const token = localStorage.getItem('jwtToken');
        if (token) setIsLoggedIn(true);
    }, []);

    // Funkcje obsługujące zmiany w polach formularza
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    // Funkcja obsługująca wysyłanie formularza
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Walidacja pól
        if (!email || !password) {
            setError('Proszę wypełnić oba pola.');
            return;
        }

        try {
            // Wysłanie danych logowania na backend
            const response = await fetch('https://localhost:7056/api/ClientLogin/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ email, password }), // Przekazywanie email i password
            });

            if (response.ok) {
                const data = await response.json();

                // Zakładamy, że token jest zwracany jako 'token' w odpowiedzi
                const token = data.token;

                if (token) {
                    // Zapisanie tokenu w localStorage
                    localStorage.setItem('jwtToken', token);
                    setIsLoggedIn(true); // Ustawienie stanu na zalogowany
                    alert('Zalogowano pomyślnie!');
                    setEmail('');
                    setPassword('');
                    setError('');
                } else {
                    setError('Nie udało się zalogować. Brak tokenu.');
                }
            } else {
                setError('Niepoprawne dane logowania.');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setError('Wystąpił błąd podczas logowania.');
        }
    };

    // Funkcja obsługująca wylogowanie
    const handleLogout = () => {
        localStorage.removeItem('jwtToken'); // Usuń token z localStorage
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
                        <label htmlFor="email">Adres e-mail</label><br />
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
                        <label htmlFor="password">Hasło</label><br />
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
                </form>
            )}
        </div>
    );
};

export default LoginForm;
