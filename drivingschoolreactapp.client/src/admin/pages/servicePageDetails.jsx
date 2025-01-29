import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";

function ServiceDetailsPage() {
    const { IdService } = useParams(); // Pobranie ID usługi z URL
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stan dla modalu usuwania
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchById(IdService);
                setService(response.data);
            } catch (error) {
                console.error(error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [IdService]);

    const handleAddVariant = () => {
        navigate(`/variantPageAdd/${IdService}`);
    };

    const handleEditVariant = (variantId) => {
        navigate(`/variantPageEdit/${variantId}/${IdService}`);
    };

    // Otwórz okno dialogowe usuwania
    const handleDeleteVariantClick = (variant) => {
        setVariantToDelete(variant);
        setShowDeleteModal(true);
    };

    // Zamknij okno dialogowe
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setVariantToDelete(null);
    };

    // Potwierdzenie usunięcia
    const handleConfirmDeleteVariant = async () => {
        if (!variantToDelete) return;

        try {
            await createAPIEndpoint(ENDPOINTS.VARIANTSERVICE).delete(variantToDelete.idVariantService);
            setService((prevService) => ({
                ...prevService,
                variantServices: prevService.variantServices.filter(v => v.idVariantService !== variantToDelete.idVariantService),
            }));
        } catch (error) {
            console.error("Błąd usuwania wariantu:", error);
            setError("Nie udało się usunąć wariantu.");
        } finally {
            setShowDeleteModal(false);
            setVariantToDelete(null);
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
                    <p><strong>Cena:</strong> {service.servicePrice} zł</p>
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

                    <div className="d-flex justify-content-start align-items-center mb-3">
                        <button className="btn btn-success btn-sm" onClick={handleAddVariant}>
                            + Dodaj wariant
                        </button>
                    </div>

                    {service.variantServices && service.variantServices.length > 0 ? (
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
                                    {service.variantServices.map((variant) => (
                                        <tr key={variant.idVariantService}>
                                            <td>{variant.variant}</td>
                                            <td>{variant.numberTheoryHours}</td>
                                            <td>{variant.numberPraticeHours}</td>
                                            <td>{variant.price} zł</td>
                                            <td>
                                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditVariant(variant.idVariantService)}>
                                                    Edytuj
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVariantClick(variant)}>
                                                    Usuń
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p className="text-muted">Brak wariantów dla tej usługi.</p>
                    )}
                </div>
            )}

            {/* MODAL POTWIERDZENIA USUNIĘCIA */}
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Potwierdzenie usunięcia</h5>
                                <button type="button" className="close btn btn-outline-secondary" onClick={handleCloseDeleteModal}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Czy na pewno chcesz usunąć wariant <strong>{variantToDelete?.variant}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDeleteVariant}>
                                    Usuń
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceDetailsPage;
