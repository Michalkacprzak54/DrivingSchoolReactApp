import React, { useState, useContext } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie, deleteCookie } from "../cookieUtils";
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

const DeleteClient = () => {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { isLoggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!isLoggedIn) {
        navigate('/login');
    }

    const handleDeleteClient = async () => {
        try {
            await createAPIEndpoint(ENDPOINTS.CLIENT).delete(userId);
            deleteCookie("userId");
            deleteCookie("userToken");
            setSuccessMessage("Klient został pomyślnie usunięty.");
        } catch (err) {
            setError(err.response?.data?.message || "Błąd usuwania klienta.");
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h3>Usuwanie konta</h3>
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <button className="btn btn-danger mt-3" onClick={handleDeleteClient}>
                Usuń konto
            </button>
        </div>
    );
};

export default DeleteClient;
