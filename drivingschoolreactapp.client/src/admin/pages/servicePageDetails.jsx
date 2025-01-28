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

    const handleAddVariant = (id) => {
        navigate(`/variantPageAdd/${id}`);
    };

    const handleEditVariant = (variant) => {
        console.log("Edycja wariantu:", variant);
        // Tutaj otwórz modal lub przekieruj do formularza edycji
    };

    const handleDeleteVariant = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć ten wariant?")) {
            console.log("Usuwanie wariantu ID:", id);
            // Tutaj wywołaj API do usuwania wariantu
        }
    };

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
                    <>
                        <div className="d-flex justify-content-start align-items-center mb-3">
                            <button className="btn btn-success btn-sm" onClick={() => handleAddVariant(service.idService)}>
                                + Dodaj wariant
                            </button>
                        </div>

                        {service.variantServices && service.variantServices.length > 0 ? (
                            <>
                                {/* Jeśli są opublikowane warianty */}
                                {service.variantServices.some(variant => variant.isPublished) && (
                                    <>
                                        <h6 className="mt-3">✅ Opublikowane warianty</h6>
                                        <table className="table table-bordered table-hover">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Wariant</th>
                                                    <th>Teoria (godziny)</th>
                                                    <th>Praktyka (godziny)</th>
                                                    <th>Cena (zł)</th>
                                                    <th>Akcje</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {service.variantServices
                                                    .filter(variant => variant.isPublished)
                                                    .map((variant) => (
                                                        <tr key={variant.idVariantService}>
                                                            <td>{variant.variant}</td>
                                                            <td>{variant.numberTheoryHours}</td>
                                                            <td>{variant.numberPraticeHours}</td>
                                                            <td>{variant.price} zł</td>
                                                            <td>
                                                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditVariant(variant.idVariantService)}>
                                                                    Edytuj
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {/* Jeśli są nieopublikowane warianty */}
                                {service.variantServices.some(variant => !variant.isPublished) && (
                                    <>
                                        <h6 className="mt-4">❌ Nieopublikowane warianty</h6>
                                        <table className="table table-bordered table-hover">
                                            <thead className="table-secondary">
                                                <tr>
                                                    <th>Wariant</th>
                                                    <th>Teoria (godziny)</th>
                                                    <th>Praktyka (godziny)</th>
                                                    <th>Cena (zł)</th>
                                                    <th>Akcje</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {service.variantServices
                                                    .filter(variant => !variant.isPublished)
                                                    .map((variant) => (
                                                        <tr key={variant.idVariantService}>
                                                            <td>{variant.variant}</td>
                                                            <td>{variant.numberTheoryHours}</td>
                                                            <td>{variant.numberPraticeHours}</td>
                                                            <td>{variant.price} zł</td>
                                                            <td>
                                                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditVariant(variant.idVariantService)}>
                                                                    Edytuj
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVariant(variant.idVariantService)}>
                                                                    Usuń
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-muted">Brak wariantów dla tej usługi.</p>
                        )}
                    </>

                    
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
