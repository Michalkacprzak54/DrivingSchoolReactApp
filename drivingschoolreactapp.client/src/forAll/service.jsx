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
            console.error("B³¹d podczas pobierania uslug:", error);
            setError("B³¹d pobierania danych. Spróbuj ponownie póŸniej.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchServices();
    }, []);


    return (
        <div>
            <h2>Us³ugi</h2>
            {loading && <p>£adowanie danych...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {Array.isArray(services) && services.length > 0 ? (
                    services.map(service => (
                        <li key={service.idService}>
                            <strong>:</strong> {service.serviceName}<br />
                            <strong>:</strong> {service.serviceDescription}<br />
                            <strong>:</strong> {service.serviceNetPrice}<br />
                            <strong>:</strong> {service.serviceVatRate}<br />
                            <strong>:</strong> {service.serviceType}<br />
                        </li>
                    ))
                ) : (
                    <p>Nie znaleziono us³ug.</p>
                )}
            </ul>
        </div>
    );
}

export default ServicesPage;
