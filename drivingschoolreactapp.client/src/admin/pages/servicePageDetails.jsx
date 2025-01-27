import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";

function ServiceDetailsPage() {
    const { IdService } = useParams(); // Pobranie ID usługi z URL
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchById(IdService);
                setService(response.data);
                setSelectedPrice(response.data.servicePrice); // Ustawienie początkowej ceny
            } catch (error) {
                console.log(error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [IdService]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Szczegóły usługi</h2>
                <button className="btn btn-primary" onClick={() => navigate("/services")}>
                    Powrót do listy usług
                </button>
            </div>

            {loading && <p className="text-center">Ładowanie danych...</p>}
            {error && <p className="alert alert-danger">{error}</p>}

            {service && (
                <div className="card shadow p-4">
                    <h4 className="mb-3">{service.serviceName}</h4>
                    <p><strong>Opis:</strong> {service.serviceDescription}</p>
                    <p><strong>Cena:</strong> {selectedPrice} zł</p>
                    <p><strong>Typ:</strong> {service.serviceType}</p>
                    <p><strong>Miejsce:</strong> {service.servicePlace}</p>
                    <p><strong>Kategoria:</strong> {service.serviceCategory}</p>
                    <p><strong>Minimalny wiek:</strong> {service.minimumAge} lat</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {service.isPublic ? (
                            <span className="badge bg-success">Opublikowane</span>
                        ) : (
                            <span className="badge bg-danger">Nieopublikowane</span>
                        )}
                    </p>

                    {service.variantServices && service.variantServices.length > 0 && (
                        <>
                            <h5 className="mt-4">Dostępne warianty:</h5>
                            <table className="table table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Wariant</th>
                                        <th>Teoria (godziny)</th>
                                        <th>Praktyka (godziny)</th>
                                        <th>Cena (zł)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {service.variantServices.map((variant) => (
                                        <tr key={variant.idVariantService}>
                                            <td>{variant.variant}</td>
                                            <td>{variant.numberTheoryHours}</td>
                                            <td>{variant.numberPraticeHours}</td>
                                            <td>{variant.price} zł</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    
                    <div className="col-lg-4">
                        {service.photos && service.photos.length > 0 ? (
                            <div className="photos-grid">
                                {service.photos.map((photo, index) => {
                                    const photoUrl = `/public/${photo.photoPath}`; 
                                    return (
                                        <div key={index} className="photo-item mb-3">
                                            <img
                                                src={photoUrl}
                                                alt={photo.alternativeDescription || "Zdjęcie usługi"}
                                                className="img-fluid rounded shadow"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Brak zdjęć dla tej usługi.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceDetailsPage;
