import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; // Zakładając, że AuthContext jest w tym folderze

const NavBarInstructor = () => {
    const { isLoggedIn, userRole, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Driving School</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn && userRole === 'instructor' ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/instructor/dashboard">Panel Instruktora</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={logout}>
                                        Wyloguj się
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Zaloguj się</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBarInstructor;
