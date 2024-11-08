import React, { useState } from 'react';

const LoginForm = () => {
    // Stan dla pól formularza
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Funkcja obsługująca zmiany w polach formularza
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Funkcja obsługująca wysyłanie formularza
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prosta walidacja
        if (!email || !password) {
            setError('Proszę wypełnić oba pola.');
            return;
        }

        try {
            // Wysłanie danych na backend
            const response = await fetch('https://localhost:7056/api/ClientLogin/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ email, password }), // Przekazywanie email i password
            });

            if (response.ok) {
                alert('Zalogowano pomyślnie!');
                setEmail('');  // Czyszczenie pola email
                setPassword('');  // Czyszczenie pola hasło
            } else {
                alert('Niepoprawne dane logowania.');
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas logowania.');
        }
    };

    return (
        <div>
            <h2>Logowanie</h2>

            {/* Błąd walidacji */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

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
        </div>
    );
};

export default LoginForm;
