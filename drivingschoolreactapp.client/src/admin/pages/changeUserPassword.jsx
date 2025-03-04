﻿import { useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import ClientDocumentsPage from '../../instructor/pages/clientDocumentsPage';
import SignupForCourse from './signupForCourse';
import regexPatterns from '../../utils/regexPatterns';

export default function ChangePassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('password');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (email.includes('@') && email.includes('.')) {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT_PASSWORD).fetchByEmail(email);
                if (response.status === 200) {
                    const data = await response.data
                    console.log(data);
                    setUserId(data.idClient);
                    setStep(2);
                } else {
                    setError('Nie znaleziono użytkownika o podanym adresie email.');
                }
            } catch (err) {
                console.log(err);
                setError('Wystąpił błąd podczas sprawdzania użytkownika.');
            } 
        } else {
            setError('Podaj poprawny adres email.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');

        if (!regexPatterns.password.test(passwordData.newPassword)) {
            setError('Hasło musi mieć min. 8 znaków, zawierać co najmniej jedną literę i jedną cyfrę.');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Nowe hasło i potwierdzenie muszą być takie same.');
            return;
        }


        try {
            await createAPIEndpoint(ENDPOINTS.CLIENT_PASSWORD + `/NewPassword`).put(
                userId,
                JSON.stringify(passwordData.newPassword),
                {
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Hasło zostało zmienione pomyślnie!');
            setStep(1);
            setEmail('');
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Błąd zmiany hasła.');
        }
    };

    return (
        <div className="container py-4">
            {/* Zakładki */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Zmień Hasło
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Dokumenty Klienta
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'sigingUp' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sigingUp')}
                    >
                        Zapisz na kurs
                    </button>
                </li>
            </ul>

            {/* Treść zakładek */}
            <div>
                {activeTab === 'password' && (
                    <>
                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit} className="mb-3">
                                <h2 className="mb-3">Wprowadź email</h2>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <button type="submit" className="btn btn-primary w-100">Dalej</button>
                            </form>
                        )}
                        {step === 2 && (
                            <form onSubmit={handlePasswordChange} className="mb-3">
                                <h2 className="mb-3">Zmień hasło</h2>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Nowe hasło"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Potwierdź hasło"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <button type="submit" className="btn btn-success w-100">Zmień hasło</button>
                            </form>
                        )}
                    </>
                )}
                {activeTab === 'documents' && <ClientDocumentsPage />}
                {activeTab === 'sigingUp' && <SignupForCourse />}
            </div>
        </div>
    );
}

