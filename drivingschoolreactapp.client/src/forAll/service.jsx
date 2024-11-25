import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(() => {
        // Inicjalizowanie koszyka z localStorage
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchAll();
            setServices(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania usług:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (service) => {
        const updatedCart = [...cart, service];
        setCart(updatedCart); 
        localStorage.setItem('cart', JSON.stringify(updatedCart)); 
        alert(`Dodano do koszyka: ${service.serviceName}`);
    };


    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div className="services-page">
            <h2 className="page-title">Usługi</h2>
            {loading && <p className="loading">Ładowanie danych...</p>}
            {error && <p className="error">{error}</p>}
            <div className="services-grid">
                {Array.isArray(services) && services.length > 0 ? (
                    services.map(service => {
                        // Obliczanie ceny brutto
                        const grossPrice = service.serviceNetPrice * (1 + service.serviceVatRate / 100);

                        return (
                            <div key={service.idService} className="service-item">
                                <h3 className="service-name">{service.serviceName}</h3>
                                <p className="service-description">{service.serviceDescription}</p>
                                <p className="service-gross-price"><strong>Cena brutto:</strong> {grossPrice.toFixed(2)} zł</p>

                                {/* Ukryty typ usługi */}
                                <p className="service-type" style={{ display: 'none' }}><strong>Typ usługi:</strong> {service.serviceType}</p>
                                <button
                                    className="add-to-cart-button"
                                    onClick={() => addToCart(service)}
                                >
                                    Dodaj do koszyka
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="no-services">Nie znaleziono usług.</p>
                )}
            </div>
        </div>
    );
}

export default ServicesPage;
