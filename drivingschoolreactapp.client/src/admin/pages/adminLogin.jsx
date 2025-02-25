import { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';
import { Link } from 'react-router-dom';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookieUtils';
import regexPatterns from '../../utils/regexPatterns';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminId, setAdminId] = useState(null);

    // Sprawdzamy, czy instruktor jest zalogowany
    useEffect(() => {
        const token = getCookie('jwtTokenAdmin');
        const storedAdminId = getCookie('adminId');
        const storedRole = getCookie('role');


        if (token && storedAdminId && storedRole) {
            setIsLoggedIn(true);
            setAdminId(storedAdminId);
        }
    }, []);

    // Obsługuje zmiany w polach formularza
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    // Obsługuje wysłanie formularza logowania
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Proszę wypełnić oba pola.');
            return;
        }

        if (!regexPatterns.email.test(email)) {
            setError('Niepoprawny format adresu e-mail.');
            return;
        }

        if (!regexPatterns.password.test(password)) {
            setError('Hasło musi mieć min. 8 znaków, zawierać co najmniej jedną literę i jedną cyfrę.');
            return;
        }


        try {
            const response = await createAPIEndpoint(ENDPOINTS.ADMIN_LOGIN).loginAdmin({
                email,
                password,
            });

            if (response.data.token) {
                const token = response.data.token;
                const adminId = response.data.adminId;
                const role = response.data.role;

                setCookie('jwtTokenAdmin', token);
                setCookie('adminId', adminId);
                setCookie('role', role);

                setIsLoggedIn(true);
                setAdminId(adminId)
                alert('Zalogowano pomyślnie!');

                setEmail('');
                setPassword('');
                setError('');
                window.location.reload(); // Odświeżenie strony po zalogowaniu
            } else {
                setError('Nie udało się zalogować. Brak tokenu.');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas logowania.');
        }
    };

    const handleLogout = () => {
        deleteCookie('jwtTokenAdmin');
        deleteCookie('adminId');
        deleteCookie('role');
        setIsLoggedIn(false);
        setAdminId(null);
        alert('Wylogowano pomyślnie!');
        window.location.reload(); // Odświeżenie strony po wylogowaniu
    };

    return (
        <div className="div-form">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">
                            {isLoggedIn ? 'Zalogowany Administrator' : 'Logowanie Administratora'}
                        </h2>
                        {error && (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        )}
                        {isLoggedIn ? (
                            <div className="text-center">
                                <p className="mb-4">Jesteś zalogowany jako administrator.</p>
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
                                    <p>
                                        Nie jesteś administratorem?{' '}
                                        <Link to="/instructorLogin" className="text-decoration-none">
                                            Zaloguj się jako instruktor
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

export default AdminLogin;
