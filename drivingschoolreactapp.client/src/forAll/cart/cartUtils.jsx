export const getCart = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.map(product => ({
            ...product,
            grossPrice: product.servicePrice,
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

    // Wybieramy wariant na podstawie idVariantService
    const selectedVariant = service.variantServices.find(
        (variant) => variant.idVariantService === parseInt(formData.selectedVariant, 10)
    );

    if (!selectedVariant) {
        // Jeśli nie znaleziono wybranego wariantu, zwróć błąd lub wykonaj inne działanie
        console.error("Wariant nie został znaleziony.");
        return;
    }

    // Generowanie uniqueId na podstawie idVariantService
    const uniqueId = `${selectedVariant.idVariantService}`;

    const existingItemIndex = cart.findIndex(item => item.uniqueId === uniqueId);

    if (existingItemIndex >= 0) {
        // Zwiększ ilość, jeśli element już istnieje
        cart[existingItemIndex].quantity += 1;
    } else {
        // Dodaj nowy element, jeśli go nie ma
        const grossPrice = selectedVariant.price;
        cart.push({
            uniqueId,
            idService: service.idService,
            serviceName: service.serviceName,
            serviceDescription: service.serviceDescription,
            servicePrice: grossPrice, 
            quantity: 1,
            variantName: selectedVariant.variant, 
            variantTheory: selectedVariant.numberTheoryHours, 
            variantPratice: selectedVariant.numberPraticeHours, 
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
