import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-light py-4 border-top w-100">
            <div className="text-center">
                <p className="mb-0">&copy; 2024 OSK Test Test. Wszystkie prawa zastrzeżone.</p>
                <p className="mb-1">
                    <Link to="/contact" className="text-decoration-none">Kontakt</Link>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
