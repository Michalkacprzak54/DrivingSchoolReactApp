import React, { useEffect, useState } from 'react';
import { getCart, clearCart } from './cartUtils';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';
import { getCookie } from '../../cookieUtils';

function PaymentPage() {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = getCart();
        setCart(savedCart);
        // Oblicz sumę
        const total = savedCart.reduce((total, product) => total + product.grossPrice * product.quantity, 0);
        setTotalPrice(total.toFixed(2));
    }, []);

    const handlePayment = async () => {
        const token = getCookie('jwtToken');
        const clientId = getCookie('userId');

        if (!token || !clientId) {
            alert("Użytkownik nie jest zalogowany.");
            navigate('/login');
            return;
        }

        const purchaseDate = new Date().toISOString();
        const clientServiceData = cart.map(product => ({
            Quantity: product.quantity,
            Client: {
                idClient: clientId
            },
            Service: {
                idService: product.idService
            },
            basicPractice: product.basicPractice,
            extendedPractice: product.extendedPractice,
            onlineTheory: product.onlineTheory,
            stationaryTheory: product.stationaryTheory,
            theoryCompleted: product.theoryCompleted,
            manual: product.manual,
            automatic: product.automatic,
            notes: product.notes || ''
        }));
        clientServiceData.forEach(item => item.purchaseDate = purchaseDate);

        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE).create(clientServiceData);
            clearCart();
            setCart([]);
            console.log('Payment processed successfully', response.data);
            alert("Płatność przetworzona! (to tylko makieta)");
        } catch (error) {
            // Sprawdzamy, czy error ma odpowiedź z serwera
            if (error.response) {
                console.error(`Error status: ${error.response.status}`);
                console.error('Error response data:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
                alert('Błąd połączenia. Brak odpowiedzi od serwera.');
            } else {
                // W przypadku innych błędów, np. błędów w kodzie
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
                                            Cena: {product.grossPrice.toFixed(2)} zł x {product.quantity} ={' '}
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
                        <p>Wybierz metodę płatności:</p>
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary w-48" onClick={handlePayment}>Płatność kartą</button>
                            <button className="btn btn-success w-48" onClick={handlePayment}>Płatność przelewem</button>
                            <button className="btn btn-warning w-48" onClick={handlePayment}>Płatność przy odbiorze</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default PaymentPage;
