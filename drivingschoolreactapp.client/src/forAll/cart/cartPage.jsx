import React, { useState, useEffect, useMemo } from 'react';
import { getCart, removeFromCart, updateQuantity, clearCart } from './cartUtils';

function CartPage() {
    const [cart, setCart] = useState([]);

    // Pobieranie koszyka przy montowaniu komponentu
    useEffect(() => {
        setCart(getCart());
    }, []);

    // Usuwanie produktu z koszyka
    const handleRemove = (idService) => {
        removeFromCart(idService);
        setCart(prevCart => prevCart.filter(item => item.idService !== idService));
    };

    // Aktualizacja ilości produktu
    const handleUpdateQuantity = (idService, quantity) => {
        if (quantity > 0) {
            updateQuantity(idService, quantity);
            setCart(prevCart =>
                prevCart.map(item =>
                    item.idService === idService ? { ...item, quantity } : item
                )
            );
        }
    };

    // Opróżnianie koszyka
    const handleClearCart = () => {
        clearCart();
        setCart([]);
    };

    // Obliczanie łącznej ceny
    const calculateTotal = useMemo(() => {
        return cart.reduce((total, product) => total + product.grossPrice * product.quantity, 0).toFixed(2);
    }, [cart]);

    return (
        <div>
            <h2>Twój Koszyk</h2>
            {cart.length === 0 ? (
                <p>Twój koszyk jest pusty.</p>
            ) : (
                <>
                    <ul>
                        {cart.map((product) => (
                            <li key={`${product.idService}-${product.quantity}`}>
                                <h3>{product.serviceName}</h3>
                                <p>{product.serviceDescription}</p>
                                <p>Cena brutto: {product.grossPrice.toFixed(2)} zł</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>Ilość:</span>
                                    <button onClick={() => handleUpdateQuantity(product.idService, product.quantity - 1)}>-</button>
                                    <span>{product.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(product.idService, product.quantity + 1)}>+</button>
                                </div>
                                <button
                                    onClick={() => handleRemove(product.idService)}
                                    style={{ marginTop: '10px', color: 'red' }}
                                >
                                    Usuń
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: '20px' }}>
                        <h3>Podsumowanie:</h3>
                        <p>Łączna cena: {calculateTotal} zł</p>
                        <button onClick={handleClearCart} style={{ marginTop: '10px' }}>
                            Opróżnij koszyk
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
