import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate } from 'react-router-dom'

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    


    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div className="services-page">
            <h2 className="page-title text-center">Usługi</h2>
            {loading && <p className="loading text-center">Ładowanie danych...</p>}
            {error && <p className="error text-center text-danger">{error}</p>}

            <div className="container">
                <div className="row">
                    {Array.isArray(services) && services.length > 0 ? (
                        services.map(service => {

                            return (
                                <div key={service.idService} className="col-md-4 mb-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{service.serviceName}</h5>
                                            <p className="card-text">{service.serviceDescription}</p>
                                            <p className="card-text"><strong>Cena brutto:</strong> {service.servicePrice} zł</p>
                                            {/* Ukryty typ usługi */}
                                            <p className="service-type" style={{ display: 'none' }}><strong>Typ usługi:</strong> {service.serviceType}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate(`/service/${service.idService}`)}
                                            >
                                                Zobacz szczegóły
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-services text-center">Nie znaleziono usług.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ServicesPage;
