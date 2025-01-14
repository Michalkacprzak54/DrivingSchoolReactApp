import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { addToCart } from './cart/cartUtils';

function ServiceDetailPage() {
    const { idService } = useParams(); // Pobranie idService z URL
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ selectedVariant: '' });
    const [selectedPrice, setSelectedPrice] = useState(null); // Stan dla dynamicznej ceny

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Znajdź cenę wybranego wariantu i ustaw ją w stanie
        const selectedVariant = service.variantServices.find(
            (variant) => variant.idVariantService === parseInt(value, 10)
        );
        setSelectedPrice(selectedVariant ? selectedVariant.price : service.servicePrice);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.selectedVariant) {
            newErrors.variant = 'Proszę wybrać jeden z dostępnych wariantów.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        addToCart(service, formData);
    };

    // Funkcja do pobierania szczegółów usługi
    const fetchServiceDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchById(idService);
            setService(response.data);
            setSelectedPrice(response.data.servicePrice); // Ustawienie początkowej ceny
        } catch (error) {
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceDetails();
    }, [idService]);

    return (
        <div className="service-detail-page container py-5">
            {loading && <p>Ładowanie szczegółów...</p>}
            {error && <p>{error}</p>}
            {service && (
                <div className="row">
                    {/* Szczegóły usługi */}
                    <div className="col-lg-8">
                        <h2>{service.serviceName}</h2>
                        <p>{service.serviceDescription}</p>
                        <p>
                            <strong>Cena brutto:</strong>{' '}
                            {selectedPrice !== null ? `${selectedPrice} zł` : `${service.servicePrice} zł`}
                        </p>
                        <p><strong>Typ usługi:</strong> {service.serviceType}</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="variantSelect">Wybierz wariant:</label>
                                <select
                                    id="variantSelect"
                                    name="selectedVariant"
                                    className="form-control"
                                    value={formData.selectedVariant}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Wybierz wariant --</option>
                                    {service.variantServices.map((variant) => (
                                        <option
                                            key={variant.idVariantService}
                                            value={variant.idVariantService}
                                        >
                                            {variant.variant} - {variant.numberTheoryHours}h teorii, {variant.numberPraticeHours}h praktyki)
                                        </option>
                                    ))}
                                </select>
                                {errors.variant && <p className="text-danger">{errors.variant}</p>}
                            </div>

                            <button type="submit" className="btn btn-primary">Dodaj do koszyka</button>
                        </form>
                    </div>

                    {/* Zdjęcia usługi */}
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
                                                className="img-fluid"
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

export default ServiceDetailPage;
