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

    const [formData, setFormData] = useState({
        theoryStatus: "",
        practiceType: "",
        serviceOption: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (service.serviceType === "Kurs") {
            if (formData.theoryStatus === "") newErrors.theoryStatus = 'Proszę wybrać formę praktyki.';
            if (formData.practiceType === "") newErrors.practiceType = 'Proszę wybrać typ praktyki.';
        } else if (service.serviceType === "Usługa") {
            if (formData.serviceOption === "") newErrors.serviceOption = 'Proszę wybrać opcję usługi.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        console.log('Form submitted:', formData);
        addToCart(service, formData);
    };

    // Funkcja do pobierania szczegółów usługi
    const fetchServiceDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchById(idService);
            setService(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania szczegółów usługi:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceDetails();
    }, [idService]);

    return (
        <div className="service-detail-page">
            {loading && <p>Ładowanie szczegółów...</p>}
            {error && <p>{error}</p>}
            {service && (
                <div className="service-detail">
                    <h2>{service.serviceName}</h2>
                    <p>{service.serviceDescription}</p>
                    <p><strong>Cena netto:</strong> {service.serviceNetPrice} zł</p>
                    <p><strong>Cena brutto:</strong> {service.serviceNetPrice * (1 + service.serviceVatRate / 100)} zł</p>
                    <p><strong>Typ usługi:</strong> {service.serviceType}</p>

                    {/* Wyświetlanie zdjęć */}
                    {service.photos && service.photos.length > 0 ? (
                        <div className="service-photos">
                            <div className="photos-grid">
                                {service.photos.map((photo, index) => {
                                    const photoUrl = `/public/${photo.photoPath}`;
                                    return (
                                        <div key={index} className="photo-item">
                                            <img
                                                src={photoUrl}
                                                alt={photo.alternativeDescription || "Zdjęcie usługi"}
                                                className="service-photo"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p>Brak zdjęć dla tej usługi.</p>
                    )}

                    {/* Renderowanie odpowiedniego formularza */}
                    {service.serviceType === "Kurs" ? (
                        <form onSubmit={handleSubmit} className="service-form">
                            <div className="input-group">
                                <label htmlFor="theoryStatus" className="input-label">Wybierz formę praktyki</label>
                                <select
                                    id="theoryStatus"
                                    name="theoryStatus"
                                    value={formData.theoryStatus}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Wybierz...</option>
                                    <option value="stacjonarna">Stacjonarna</option>
                                    <option value="online">Online</option>
                                    <option value="zaliczona">Zaliczona</option>
                                </select>
                                {errors.theoryStatus && <p className="error-message">{errors.theoryStatus}</p>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="practiceType" className="input-label">Typ praktyki</label>
                                <select
                                    id="practiceType"
                                    name="practiceType"
                                    value={formData.practiceType}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Wybierz...</option>
                                    <option value="podstawowa">Podstawowa - 30h</option>
                                    <option value="rozszerzona">Rozszerzona - 40h</option>
                                </select>
                                {errors.practiceType && <p className="error-message">{errors.practiceType}</p>}
                            </div>

                            <button type="submit" className="add-to-cart-button">
                                Dodaj do koszyka
                            </button>
                        </form>
                    ) : service.serviceType === "Usługa" ? (
                        <form onSubmit={handleSubmit} className="service-form">
                            <div className="input-group">
                                <label htmlFor="serviceOption" className="input-label">Opcja usługi</label>
                                <select
                                    id="serviceOption"
                                    name="serviceOption"
                                    value={formData.serviceOption}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Wybierz...</option>
                                    <option value="automat">Automat</option>
                                    <option value="manual">Manual</option>
                                </select>
                                {errors.serviceOption && <p className="error-message">{errors.serviceOption}</p>}
                            </div>

                            <button type="submit" className="add-to-cart-button">
                                Dodaj do koszyka
                            </button>
                        </form>
                    ) : (
                        <p>Nieobsługiwany typ usługi.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ServiceDetailPage;
