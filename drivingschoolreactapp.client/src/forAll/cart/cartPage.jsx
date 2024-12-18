﻿import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateQuantity, clearCart } from './cartUtils';
import { AuthContext } from '../../authContext';

function CartPage() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext); 

    useEffect(() => {
        setCart(getCart(true));  
    },);

    const handleRemove = (idService) => {
        removeFromCart(idService);
        setCart(prevCart => prevCart.filter(item => item.idService !== idService));
    };

    // Aktualizacja ilości produktu
    const handleUpdateQuantity = (idService, quantity) => {
        if (quantity > 0) {
            updateQuantity(idService, quantity, isLoggedIn);
            setCart(prevCart =>
                prevCart.map(item =>
                    item.idService === idService ? { ...item, quantity } : item
                )
            );
        }
    };

    const handleClearCart = () => {
        clearCart(isLoggedIn);  
        setCart([]);  
    };

    const calculateTotal = useMemo(() => {
        return cart.reduce((total, product) => total + product.grossPrice * product.quantity, 0).toFixed(2);
    }, [cart]);

    const goToPaymentPage = () => {
        navigate('/payment'); 
    };

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
                                <div>
                                    <span>Ilość:</span>
                                    <button onClick={() => handleUpdateQuantity(product.idService, product.quantity - 1)}>-</button>
                                    <span>{product.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(product.idService, product.quantity + 1)}>+</button>
                                </div>
                                <button onClick={() => handleRemove(product.idService)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <h3>Podsumowanie:</h3>
                        <p>Łączna cena: {calculateTotal} zł</p>
                        <button onClick={handleClearCart}>Opróżnij koszyk</button>
                        <button onClick={goToPaymentPage}>Przejdź do płatności</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
