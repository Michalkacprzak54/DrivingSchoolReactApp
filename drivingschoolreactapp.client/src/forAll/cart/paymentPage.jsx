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

        const clientServiceData = cart.map(product => ({
            //Status: 'zamówiona',
            Quantity: product.quantity,
            Client: {
                idClient: clientId
            },
            Service: {
                idService: product.idService
            },
            notes: `Opcje: ${product.theoryStatus || ''}, ${product.practiceType || ''}, ${product.serviceOption || ''}`
        }));

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
        <div className="payment-page">
            <h2>Podsumowanie zamówienia</h2>
            {cart.length === 0 ? (
                <p>Twój koszyk jest pusty.</p>
            ) : (
                <>
                    <div className="order-summary">
                        <h3>Twoje zamówienie</h3>
                        <ul>
                            {cart.map((product) => (
                                <li key={product.idService}>
                                    <h4>{product.serviceName}</h4>
                                    <p>{product.serviceDescription}</p>
                                    <p>
                                        Cena: {product.grossPrice.toFixed(2)} zł x {product.quantity} ={' '}
                                        {(product.grossPrice * product.quantity).toFixed(2)} zł
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="total-price">
                            <h3>Łączna cena: {totalPrice} zł</h3>
                        </div>
                    </div>

                    <div className="payment-method">
                        <h3>Metoda płatności</h3>
                        <p>Wybierz metodę płatności:</p>
                        <button onClick={handlePayment}>Płatność kartą</button>
                        <button onClick={handlePayment}>Płatność przelewem</button>
                        <button onClick={handlePayment}>Płatność przy odbiorze</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PaymentPage;
