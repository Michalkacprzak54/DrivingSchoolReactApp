﻿import { useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { getZonedCurrentDate } from '../utils/dateUtils';
import regexPatterns from '../utils/regexPatterns';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if (!regexPatterns.firstName.test(formData.name)) {
            setError('Nieprawidłowy format imienia.');
            return;
        }

        if (!regexPatterns.email.test(formData.email)) {
            setError('Nieprawidłowy format adresu e-mail.');
            return;
        }

        if (formData.phone && !regexPatterns.phoneNumber.test(formData.phone)) {
            setError('Nieprawidłowy format numeru telefonu.');
            return;
        }
        if (!formData.message) {
            setError('Wiadomość nie może być pusta.');
            return;
        }

        const formattedDate = getZonedCurrentDate();

        const dataToSend = {
            ...formData,
            contactDate: formattedDate,
            phone: formData.phone.trim() === '' ? null : formData.phone,
            isCurrent: true
        };

        try {
            const response = await createAPIEndpoint(ENDPOINTS.CONTACTREQUEST).create(dataToSend);
            console.log('Contact request processed successfully', response.data);
            alert("Zgłoszenie zostało wysłane, skontaktujemy się z Tobą w najbliższym czasie");
        } catch (error) {
            if (error.response) {
                console.error(`Error status: ${error.response.status}`);
                console.error('Error response data:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
                alert('Błąd połączenia. Brak odpowiedzi od serwera.');
            } else {
                console.error('Error message:', error.message);
                alert('Błąd przetwarzania płatności. Spróbuj ponownie.');
            }
        }

        setIsSubmitted(true);
        setError('');
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ marginBottom: '50px' }}>
            <div className="card shadow" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="card-body">
                    <div className="company-contact mb-4">
                        <h2 className="text-center mb-4">Dane kontaktowe</h2>
                        <p><strong>Telefon:</strong> +24 12 56 789</p>
                        <p><strong>Telefon:</strong> +48 123 456 789</p>
                        <p><strong>Email:</strong> contact@company.com</p>
                        <p><strong>Adres:</strong> Płock, ul. Taka i Taka 33</p>
                    </div>
                    <h2 className="card-title text-center mb-4">Skontaktuj się z nami</h2>
                    {error && (
                        <div className="alert alert-danger text-center" role="alert">
                            {error}
                        </div>
                    )}
                    {isSubmitted ? (
                        <div className="text-center">
                            <h4>Dziękujemy za wiadomość!</h4>
                            <p>Skontaktujemy się z Tobą najszybciej jak to możliwe.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Imię</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Wpisz swoje imię"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Adres e-mail</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Wpisz swój e-mail"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Numer telefonu (opcjonalnie)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Wpisz swój numer telefonu (opcjonalnie)"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Wiadomość</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-control"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Wpisz swoją wiadomość"
                                    rows="4"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Wyślij wiadomość
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactForm;