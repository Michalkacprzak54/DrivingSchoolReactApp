import React, { useEffect, useState } from 'react';
import { getCart } from './cartUtils'; // Załóżmy, że masz funkcję getCart z cartUtils

function PaymentPage() {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const savedCart = getCart();
        setCart(savedCart);
        // Oblicz sumę
        const total = savedCart.reduce((total, product) => total + product.grossPrice * product.quantity, 0);
        setTotalPrice(total.toFixed(2));
    }, []);

    const handlePayment = () => {
        alert("Płatność przetworzona! (to tylko makieta)");
        // Możesz dodać logikę płatności (np. wywołanie API płatności)
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
