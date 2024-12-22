import React, { useState } from 'react';

const ContactPage = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // State for handling form submission status
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    return (



        <div className="contact-page">

            <div className="company-contact">
                <h2>Dane kontaktowe</h2>
                <p><strong>Telefon:</strong> +24 12 56 789</p>
                <p><strong>Telefon:</strong> +48 123 456 789</p>
                <p><strong>Email:</strong> contact@company.com</p>
                <p><strong>Adres:</strong> 123 Business St, City, Country</p>
            </div>

            <h1>Skontaktuj się znami</h1>
            {isSubmitted ? (
                <div className="thank-you-message">
                    <h2>Dziękujemy za wiadomość</h2>
                    <p>Skontaktujemy się z Tobą najszybciej jak to możliwe</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Imie</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Wiadomość</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit">Wyślij</button>
                </form>
            )}

            
        </div>
    );
};

export default ContactPage;
