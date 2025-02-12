import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate } from 'react-router-dom';
import CenteredSpinner from '../components/CenteredSpinner';
import { formatShortDescription } from '../utils/textFormat';

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("wszystko");
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

    const filteredServices = services.filter(service =>
        filter === "wszystko" || service.serviceType === filter
    );

    if (loading) return <CenteredSpinner />;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="services-page">
            <h2 className="page-title text-center">Usługi</h2>

            <div className="filter-buttons text-center mb-4">
                <button className={`btn btn-secondary mx-2 ${filter === "wszystko" ? "active" : ""}`} onClick={() => setFilter("wszystko")}>Wszystko</button>
                <button className={`btn btn-secondary mx-2 ${filter === "Kurs" ? "active" : ""}`} onClick={() => setFilter("Kurs")}>Krusy</button>
                <button className={`btn btn-secondary mx-2 ${filter === "Usługa" ? "active" : ""}`} onClick={() => setFilter("Usługa")}>Usługi</button>
            </div>

            <div className="container">
                <div className="row">
                    {filteredServices.length > 0 ? (
                        filteredServices
                            .filter(service => service.isPublic)
                            .map(service => (
                                <div key={service.idService} className="col-md-4 mb-4 d-flex">
                                    <div className="card h-100 d-flex flex-column">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{service.serviceName}</h5>
                                            <p className="card-text flex-grow-1">
                                                {formatShortDescription(service.serviceDescription, 150)}
                                            </p>
                                            <p className="card-text"><strong>Cena brutto:</strong> {service.servicePrice} zł</p>
                                            <button
                                                className="btn btn-primary mt-auto"
                                                onClick={() => navigate(`/service/${service.idService}`)}
                                            >
                                                Zobacz szczegóły
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="no-services text-center">Nie znaleziono usług.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ServicesPage;
