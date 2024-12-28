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

export const getCartCount = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const updateCartCount = () => {
    const cartCount = getCartCount();
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
    }
};

export const addToCart = (service, formData) => {
    const cart = getCart();

    // Generate uniqueId based on service and form data
    const uniqueId = `${service.idService}-${formData.onlineTheory ? 'onlineTheory' : formData.stationaryTheory ? 'stationaryTheory' : formData.theoryCompleted ? 'theoryCompleted' : ''}-${formData.basicPractice ? 'basicPractice' : formData.extendedPractice ? 'extendedPractice' : ''}-${formData.manual ? 'manual' : formData.automatic ? 'automatic' : ''}`;
    const existingItemIndex = cart.findIndex(item => item.uniqueId === uniqueId);

    if (existingItemIndex >= 0) {
        // Increment quantity if the item already exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add a new item if it doesn't exist
        const grossPrice = service.serviceNetPrice * (1 + service.serviceVatRate / 100);
        cart.push({
            uniqueId,
            idService: service.idService,
            serviceName: service.serviceName,
            serviceDescription: service.serviceDescription,
            serviceNetPrice: service.serviceNetPrice,
            serviceVatRate: service.serviceVatRate,
            grossPrice,
            quantity: 1,
            manual: formData.manual,
            automatic: formData.automatic,
            onlineTheory: formData.onlineTheory,
            stationaryTheory: formData.stationaryTheory,
            theoryCompleted: formData.theoryCompleted,
            basicPractice: formData.basicPractice,
            extendedPractice: formData.extendedPractice,
            photos: service.photos,
        });
    }

    saveCart(cart);
    updateCartCount();
    window.location.reload();
};

export const removeFromCart = (uniqueId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.uniqueId !== uniqueId);
    saveCart(updatedCart);
    updateCartCount();
    window.location.reload();
};

export const updateQuantity = (uniqueId, quantity) => {
    let cart = getCart();

    if (quantity > 0) {
        cart = cart.map(item =>
            item.uniqueId === uniqueId ? { ...item, quantity } : item
        );
    } else {
        cart = cart.filter(item => item.uniqueId !== uniqueId);
    }

    saveCart(cart);
    updateCartCount();
};

export const clearCart = () => {
    localStorage.removeItem('cart');
    updateCartCount();
    window.location.reload();
};
