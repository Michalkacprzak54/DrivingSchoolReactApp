import /*React,*/ { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';
import { Link } from 'react-router-dom';
import { getCookie, setCookie, deleteCookie } from '../../cookieUtils';

const InstructorLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [instructorId, setInstructorId] = useState(null);

    useEffect(() => {
        const token = getCookie('jwtToken');
        const storedInstructorId = getCookie('instructorId');

        console.log('Token from cookies:', token);
        console.log('Instructor ID from cookies:', storedInstructorId);

        if (token && storedInstructorId) {
            setIsLoggedIn(true);
            setInstructorId(storedInstructorId);
        }
    }, []);

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Poprawka: Brakowało eventu w handleSubmit
        if (!email || !password) {
            setError('Proszę wypełnić oba pola.');
            return;
        }
        try {
            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_LOGIN).loginInstructor({
                email,
                password,
            });
            console.log('Login response:', response);


            if (response.data.token) {
                const token = response.data.token;
                const instructorId = response.data.instructorId;

                console.log('Received token:', token);
                console.log('Instructor ID:', instructorId);

                setCookie('jwtToken', token);
                setCookie('instructorId', instructorId);

                setIsLoggedIn(true);
                setInstructorId(instructorId);
                alert('Zalogowano pomyślnie!');
                setEmail('');
                setPassword('');
                setError('');
            } else {
                setError('Nie udało się zalogować. Brak tokenu.');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas logowania.' + error);
            console.error('Error during login:', error);
        }
    };

    const handleLogout = () => {
        deleteCookie('jwtToken');
        deleteCookie('instructorId'); // Poprawka: Zmieniono z 'userId' na 'instructorId'
        setIsLoggedIn(false);
        setInstructorId(null);
        alert('Wylogowano pomyślnie!');
    };

    return (
        <div className="div-form">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">
                            {isLoggedIn ? 'Panel Instruktora' : 'Logowanie Instruktora'}
                        </h2>

                        {error && (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        )}

                        {isLoggedIn ? (
                            <div className="text-center">
                                <p className="mb-4">Witaj, Instruktorze! Jesteś zalogowany.</p>
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
                                        required
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
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Zaloguj się
                                </button>

                                <div className="text-center mt-3">
                                    {/*<p>*/}
                                    {/*    Zapomniałeś hasła?{' '}*/}
                                    {/*    <Link to="/reset-password" className="text-decoration-none">*/}
                                    {/*        Zresetuj hasło*/}
                                    {/*    </Link>*/}
                                    {/*</p>*/}
                                    <p>
                                        Nie jesteś instruktorem?{' '}
                                        <Link to="/login" className="text-decoration-none">
                                            Zaloguj się jako klient
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

export default InstructorLogin;
