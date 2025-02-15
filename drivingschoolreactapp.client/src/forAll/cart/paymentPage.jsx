import { useEffect, useState } from 'react';
import { getCart, clearCart } from './cartUtils';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';
import { getCookie } from '../../utils/cookieUtils';
import { getZonedCurrentDate } from '../../utils/dateUtils';

function PaymentPage() {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showTransferDetails, setShowTransferDetails] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = getCart();
        setCart(savedCart);
        const total = savedCart.reduce((total, product) => total + product.grossPrice * product.quantity, 0);
        setTotalPrice(total.toFixed(2));
    }, []);

    const handleTransfer = () => {
        setShowTransferDetails(true);
    };

    const confirmTransfer = () => {
        setShowTransferDetails(false);
        handlePayment();
    };

    const handlePayment = async () => {
        const token = getCookie('jwtToken');
        const clientId = getCookie('userId');

        if (!token || !clientId) {
            alert("Użytkownik nie jest zalogowany.");
            navigate('/login');
            return;
        }

        const purchaseDate = getZonedCurrentDate();

        const clientServiceData = cart.map(product => ({
            Quantity: product.quantity,
            Client: {
                idClient: clientId
            },
            Service: {
                idService: product.idService
            },
            VariantService: {
                idVariantService: product.uniqueId
            },
            purchaseDate
        }));

        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE).create(clientServiceData);
            clearCart();
            setCart([]);
            alert("Dziękujemy za zamówienie! Zapłać w biurze lub wyślij przelew!");
        } catch (error) {
            if (error.response) {
                console.error(`Error status: ${error.response.status}`, error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
                alert('Błąd połączenia. Brak odpowiedzi od serwera.');
            } else {
                console.error('Error message:', error.message);
                alert('Błąd przetwarzania płatności. Spróbuj ponownie.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Podsumowanie zamówienia</h2>
            {cart.length === 0 ? (
                <p className="text-center">Twój koszyk jest pusty.</p>
            ) : (
                <>
                    <div className="order-summary mb-4">
                        <h3>Twoje zamówienie</h3>
                        <ul className="list-group">
                            {cart.map((product) => (
                                <li key={product.idService} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>{product.serviceName}</h5>
                                        <p>{product.serviceDescription}</p>
                                        <p>
                                            Cena: {product.grossPrice.toFixed(2)} zł x {product.quantity} = {' '}
                                            {(product.grossPrice * product.quantity).toFixed(2)} zł
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="total-price mt-3">
                            <h3>Łączna cena: {totalPrice} zł</h3>
                        </div>
                    </div>

                    <div className="payment-method mb-4">
                        <h3>Metoda płatności</h3>
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-warning w-48" onClick={handlePayment}>Płatność przy odbiorze</button>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <button className="btn btn-warning w-48" onClick={handleTransfer}>Przelew fizyczny</button>
                        </div>
                    </div>
                </>
            )}

            {showTransferDetails && (
                <div className="transfer-details p-4 border rounded mt-4">
                    <h4>Dane do przelewu:</h4>
                    <p><strong>Numer konta:</strong> 12 3456 7890 1234 5678 9012 3456</p>
                    <p><strong>Nazwa odbiorcy:</strong> Firma XYZ</p>
                    <p><strong>Tytuł przelewu:</strong> <i>Twoje imie i nazwisko</i> Opłata za kurs</p>
                    <button className="btn btn-success mt-3" onClick={confirmTransfer}>OK</button>
                </div>
            )}
        </div>
    );
}

export default PaymentPage;
