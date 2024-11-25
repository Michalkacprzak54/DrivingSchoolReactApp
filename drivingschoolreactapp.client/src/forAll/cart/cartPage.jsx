import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQuantity, clearCart } from './cartUtils';

function CartPage() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = getCart();
        setCart(savedCart);
    }, []);

    const handleRemove = (idService) => {
        removeFromCart(idService);
        setCart(getCart());
    };

    const handleUpdateQuantity = (idService, quantity) => {
        updateQuantity(idService, quantity);
        setCart(getCart());
    };

    const handleClearCart = () => {
        clearCart();
        setCart([]);  
    };

    const calculateTotal = () => {
        return cart.reduce((total, product) => total + product.grossPrice * product.quantity, 0);
    }

    return (
        <div>
            <h2>Twój Koszyk</h2>
            {cart.length === 0 ? (
                <p>Twój koszyk jest pusty.</p>
            ) : (
                <>
                    <ul>
                        {cart.map((product) => (
                            <li key={product.idService}>
                                <h3>{product.serviceName}</h3>
                                <p>{product.serviceDescription}</p>
                                <p>Cena: {product.grossPrice} zł</p>
                                <p>
                                    Ilość:
                                    <input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) =>
                                            handleUpdateQuantity(product.idService, parseInt(e.target.value))
                                        }
                                    />
                                </p>
                                <button onClick={() => handleRemove(product.id)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <h3>Podsumowanie:</h3>
                        <p>Łączna cena: {calculateTotal()} zł</p>
                        <button onClick={handleClearCart}>Opróżnij koszyk</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;