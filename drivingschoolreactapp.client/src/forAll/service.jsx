import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    /*    const navigate = useNavigate();*/


    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchAll();
            setServices(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania uslug:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchServices();
    }, []);


    return (
        <div>
            <h2>Usługi</h2>
            {loading && <p>Ładowanie danych...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {Array.isArray(services) && services.length > 0 ? (
                    services.map(service => {
                        // Obliczanie ceny brutto
                        const grossPrice = service.serviceNetPrice * (1 + service.serviceVatRate / 100);

                        return (
                            <li key={service.idService}>
                                <strong>Nazwa usługi:</strong> {service.serviceName}<br />
                                <strong>Opis:</strong> {service.serviceDescription}<br />
                                <strong>Cena netto:</strong> {service.serviceNetPrice}<br />
                                <strong>Stawka VAT:</strong> {service.serviceVatRate}%<br />
                                <strong>Typ usługi:</strong> {service.serviceType}<br />
                                <strong>Cena brutto:</strong> {grossPrice.toFixed(2)}<br /> 
                            </li>
                        );
                    })
                ) : (
                    <p>Nie znaleziono usług.</p>
                )}
            </ul>
        </div>
    );

}

export default ServicesPage;
