import { useNavigate } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();
    return (
        <footer className="bg-light py-2 border-top w-100">
            <div className="text-center">
                <p className="mb-0">&copy; {currentYear} OSK Test Test. Wszystkie prawa zastrzeżone.</p>
                <p className="mb-1">
                    <span onClick={() => navigate('/contact')} className="text-decoration-none" style={{cursor: 'pointer', color: 'blue'} }>Kontakt</span>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
