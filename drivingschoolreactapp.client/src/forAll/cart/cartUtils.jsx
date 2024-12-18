export const getCart = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.map(product => ({
            ...product,
            grossPrice: product.grossPrice || (product.serviceNetPrice * (1 + product.serviceVatRate / 100)),
            quantity: product.quantity || 1,
        }));
    } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        return [];
    }
};

export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = (service, formData) => {
    const cart = getCart();
    const serviceIndex = cart.findIndex(item => item.idService === service.idService);
    if (serviceIndex >= 0) {
        cart[serviceIndex].quantity += 1;
    } else {
        const grossPrice = service.serviceNetPrice * (1 + service.serviceVatRate / 100);
        cart.push({
            ...service,
            grossPrice,
            quantity: 1,
            theoryStatus: formData.theoryStatus, 
            practiceType: formData.practiceType,
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
    let cart = getCart();

    if (quantity > 0) {
        cart = cart.map(item =>
            item.idService === idService ? { ...item, quantity } : item
        );
    } else {
        cart = cart.filter(item => item.idService !== idService);
    }

    saveCart(cart);
};

export const clearCart = () => {
    localStorage.removeItem('cart');
};
