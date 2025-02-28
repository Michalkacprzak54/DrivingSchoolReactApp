import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";
import CenteredSpinner from '../../components/centeredSpinner';

function ServiceDetailsPage() {
    const { IdService } = useParams(); 
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

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

    const convertDecimalAgeToYearsAndMonths = (decimalAge) => {
        const years = Math.floor(decimalAge);
        const months = Math.round((decimalAge - years) * 12);
        return months > 0 ? `${years} lat i ${months} miesięcy` : `${years} lat`;
    };

    const handleAddVariant = () => {
        navigate(`/variantPageAdd/${IdService}`);
    };

    const handleEditVariant = (variantId) => {
        navigate(`/variantPageEdit/${variantId}/${IdService}`);
    };

    const handleDeleteVariantClick = (variant) => {
        setVariantToDelete(variant);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setVariantToDelete(null);
    };

    const handleConfirmDeleteVariant = async () => {
        if (!variantToDelete) return;

        try {
            const checkResponse = await createAPIEndpoint(ENDPOINTS.VARIANTSERVICE)
                .fetchById(`${variantToDelete.idVariantService}/checkOrders`);

            if (checkResponse.data.purchased) {
                alert("Nie można usunąć tego wariantu, ponieważ został zakupiony.");
                return;
            }

            await createAPIEndpoint(ENDPOINTS.VARIANTSERVICE).delete(variantToDelete.idVariantService);

            setService((prevService) => ({
                ...prevService,
                variantServices: prevService.variantServices.filter(v => v.idVariantService !== variantToDelete.idVariantService),
            }));

            alert("Wariant usługi został usunięty!");
        } catch (error) {
            console.error("Błąd usuwania wariantu:", error);
            setError("Nie udało się usunąć wariantu.");
        } finally {
            setShowDeleteModal(false);
            setVariantToDelete(null);
        }
    };


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    const handleUploadImage = async () => {
        if (!selectedFile) {
            setError("Proszę wybrać plik przed przesłaniem.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("serviceId", IdService); 
        formData.append("alternativeDescription", "Zdjęcie pojazdu");

        try {
            const response = await createAPIEndpoint(ENDPOINTS.PHOTO + "/UploadImage").create(formData);
            console.log("Plik przesłany:", response.data);
            alert("Plik został pomyślnie przesłany!");
        } catch (error) {
            console.error("Błąd przesyłania pliku:", error);
            setError("Nie udało się przesłać zdjęcia.");
        }
    };

    const handleDeleteImage = async (photoId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to zdjęcie?")) {
            return;
        }

        try {
            const response = await createAPIEndpoint(ENDPOINTS.PHOTO + "/DeleteImage").delete(photoId);

            if (response.status === 200) {
                alert("Zdjęcie zostało usunięte.");
                setService((prevService) => ({
                    ...prevService,
                    photos: prevService.photos.filter(photo => photo.idPhoto !== photoId)
                }));
            }
        } catch (error) {
            console.error("Błąd usuwania zdjęcia:", error.response ? error.response.data : error.message);
            alert("Nie udało się usunąć zdjęcia.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Szczegóły usługi</h2>
                <button className="btn btn-primary" onClick={() => navigate("/servicesPage")}>
                    Powrót do listy usług
                </button>
            </div>

            {loading && <CenteredSpinner />}
            {error && <p className="alert alert-danger">{error}</p>}

            {service && (
                <div className="card shadow p-4">
                    <h4 className="mb-3">{service.serviceName}</h4>
                    <p><strong>Opis:</strong> {service.serviceDescription}</p>
                    <p><strong>Cena:</strong> {service.servicePrice} zł</p>
                    <p><strong>Typ:</strong> {service.serviceType}</p>
                    <p><strong>Miejsce:</strong> {service.servicePlace}</p>
                    <p><strong>Kategoria:</strong> {service.serviceCategory}</p>
                    <p><strong>Minimalny wiek:</strong> {convertDecimalAgeToYearsAndMonths(service.minimumAge)}</p>
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
                            Dodaj wariant
                        </button>
                    </div>

                   

                    {service.variantServices && service.variantServices.length > 0 ? (
                        <>
                            <h6 className="mt-3">Warianty</h6>
                            <table className="table table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Wariant</th>
                                        <th>Teoria (godziny)</th>
                                        <th>Praktyka (godziny)</th>
                                        <th>Cena (zł)</th>
                                        <th>Status</th>
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
                                                {variant.isPublished ? (
                                                    <span className="badge bg-success">Opublikowane</span>
                                                ) : (
                                                    <span className="badge bg-danger">Nieopublikowane</span>
                                                )}
                                            </td>
                                            <td>
                                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditVariant(variant.idVariantService)}>Edytuj</button>
                                                {!variant.isPublished && (
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVariantClick(variant)}>Usuń</button>
                                                )}
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


            <h6 className="mt-3">Prześlij zdjęcie usługi</h6>
            <div className="mb-3">
                <input type="file" className="form-control" onChange={handleFileChange} />
                <button className="btn btn-primary mt-2" onClick={handleUploadImage}>
                    Prześlij zdjęcie
                </button>
            </div>

            {service && service.photos && service.photos.length > 0 ? (
                <div className="photos-grid">
                    {service.photos.map((photo) => {
                        const photoUrl = `/${photo.photoPath}`;
                        return (
                            <div key={photo.idPhoto} className="photo-item mb-3">
                                <img
                                    src={photoUrl}
                                    alt={photo.alternativeDescription || "Zdjęcie usługi"}
                                    className="img-fluid rounded shadow"
                                />

                                <button
                                    className="btn btn-danger btn-sm mt-2"
                                    onClick={() => handleDeleteImage(photo.idPhoto)}
                                >
                                    Usuń zdjęcie
                                </button>

                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>Brak zdjęć dla tej usługi.</p>
            )}


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
