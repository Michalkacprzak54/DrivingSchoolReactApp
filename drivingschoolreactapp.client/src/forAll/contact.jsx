import React, { useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { toZonedTime, format } from 'date-fns-tz';

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
        if (!formData.name || !formData.email || !formData.message) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }

        const timeZone = 'Europe/Warsaw'; // Strefa czasowa Polski

        // Pobieramy aktualną datę
        const currentDate = new Date();

        const zonedDate = toZonedTime(currentDate, timeZone);

        const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });


        const dataToSend = {
            ...formData,
            contactDate: formattedDate,
            phone: formData.phone.trim() === '' ? null : formData.phone
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
                    {/* Sekcja z danymi kontaktowymi */}
                    <div className="company-contact mb-4">
                        <h2 className="text-center mb-4">Dane kontaktowe</h2>
                        <p><strong>Telefon:</strong> +24 12 56 789</p>
                        <p><strong>Telefon:</strong> +48 123 456 789</p>
                        <p><strong>Email:</strong> contact@company.com</p>
                        <p><strong>Adres:</strong> Płock, ul. Taka i Taka 33</p>
                    </div>

                    {/* Formularz kontaktowy */}
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
