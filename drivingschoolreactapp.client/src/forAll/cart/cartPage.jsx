import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateQuantity, clearCart } from './cartUtils';

function CartPage() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCart(getCart()); // Pobieramy koszyk z localStorage
    }, []);

    const handleRemove = (uniqueId) => {
        removeFromCart(uniqueId);
        setCart(prevCart => prevCart.filter(item => item.uniqueId !== uniqueId));
    };

    const handleUpdateQuantity = (uniqueId, quantity) => {
        if (quantity > 0) {
            updateQuantity(uniqueId, quantity);
            setCart(prevCart =>
                prevCart.map(item =>
                    item.uniqueId === uniqueId ? { ...item, quantity } : item
                )
            );
        }
    };

    const handleClearCart = () => {
        clearCart();
        setCart([]);
    };

    const calculateTotal = useMemo(() => {
        return cart.reduce((total, product) => total + product.grossPrice * product.quantity, 0).toFixed(2);
    }, [cart]);

    const goToPaymentPage = () => {
        navigate('/payment');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Twój Koszyk</h2>
            {cart.length === 0 ? (
                <p className="text-center">Twój koszyk jest pusty.</p>
            ) : (
                <>
                    <ul className="list-group">
                        {cart.map((product) => (
                            <li key={product.uniqueId} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>{product.serviceName}</h5>
                                    <p>{product.serviceDescription}</p>
                                    <p><strong>Cena brutto:</strong> {product.servicePrice.toFixed(2)} zł</p>
                                    <p><strong>Wariant:</strong> {product.variantName}</p>

                                    {product.variantTheory > 0 && (
                                        <p><strong>Teoria:</strong> {product.variantTheory} godz.</p>
                                    )}

                                    
                                    {product.variantPratice > 0 && (
                                        <p><strong>Praktyka:</strong> {product.variantPratice} godz.</p>
                                    )}

                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="mr-2">Ilość:</span>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleUpdateQuantity(product.uniqueId, product.quantity - 1)}>-</button>
                                    <span className="mx-2">{product.quantity}</span>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleUpdateQuantity(product.uniqueId, product.quantity + 1)}>+</button>
                                    <button className="btn btn-danger btn-sm ml-3" onClick={() => handleRemove(product.uniqueId)}>Usuń</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                        <h3>Podsumowanie:</h3>
                        <p><strong>Łączna cena:</strong> {calculateTotal} zł</p>
                        <button className="btn btn-warning mr-2" onClick={handleClearCart}>Opróżnij koszyk</button>
                        <button className="btn btn-primary" onClick={goToPaymentPage}>Przejdź do płatności</button>
                    </div>
                </>
            )}
        </div>
    );
}


export default CartPage;
