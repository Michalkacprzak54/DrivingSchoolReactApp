import React, { useContext } from 'react';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
    const { isLoggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    // Jeśli użytkownik nie jest zalogowany, przekierowujemy go na stronę logowania
    if (!isLoggedIn) {
        navigate('/login');
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card-body text-center">
                    <h1 className="mb-4">Moje Konto</h1>
                    <nav>
                        <ul className="list-unstyled">
                            <li>
                                <button
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={() => navigate(`/myCourses`)}
                                >
                                    Moje kursy
                                </button>
                            </li>
                            <li>
                                <button
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={() => navigate(`/purchaseHistory`)}
                                >
                                    Historia zakupów
                                </button>
                            </li>
                             <li>
                                <button 
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={() => navigate(`/userProfile`)}
                                >
                                    Ustawienia
                                </button>
                            </li> 
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
