import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }

        // Można dodać logikę wysyłania formularza do API

        setIsSubmitted(true);
        setError('');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
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
