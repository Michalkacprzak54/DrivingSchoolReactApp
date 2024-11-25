export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = (service) => {
    const cart = getCart();
    const serviceIndex = cart.findIndex(item => item.idService === service.idService);

    if (serviceIndex >= 0) {
        // Jeśli usługa już istnieje w koszyku, zwiększ ilość
        cart[serviceIndex].quantity += 1;
    } else {
        // Jeśli usługa nie istnieje, dodaj nową z obliczoną ceną brutto
        const grossPrice = service.serviceNetPrice * (1 + service.serviceVatRate / 100);
        cart.push({
            ...service,
            grossPrice,
            quantity: 1
        });
    }
    saveCart(cart);
};

export const removeFromCart = (idService) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.idService !== idService);
    saveCart(updatedCart);
};

export const updateQuantity = (idService, quantity) => {
    const cart = getCart();
    const serviceIndex = cart.findIndex(item => item.idService === idService);

    if (serviceIndex >= 0 && quantity > 0) {
        cart[serviceIndex].quantity = quantity;
    } else if (quantity <= 0) {
        removeFromCart(idService);
    }

    saveCart(cart);
};

export const clearCart = () => {
    localStorage.removeItem('cart');
};
