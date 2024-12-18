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
        if (formData.theoryStatus === "") newErrors.theoryStatus = 'Proszę wybrać formę praktyki.';
        if (formData.practiceType === "") newErrors.practiceType = 'Proszę wybrać typ praktyki.';

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

                    {/* Formularz z wyborem opcji */}
                    <form onSubmit={handleSubmit} className="service-form">
                        <div className="input-group">
                            <label htmlFor="theoryStatus" className="input-label">Wybierz formę praktyki</label>
                            <select
                                id="theoryStatus"
                                name="theoryStatus"
                                value={formData.theoryMode}
                                onChange={handleChange}
                                className="input-field"
                                required 
                            >
                                <option value="">Wybierz...</option>
                                <option value="stacjonarna">Stacjonarna</option>
                                <option value="online">Online</option>
                                <option value="zaliczona">Zaliczona</option>
                            </select>
                            {errors.theoryStatus && <p className="error-message">{errors.theoryMode}</p>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="practiceType" className="input-label">Typ praktyki</label>
                            <select
                                id="practiceType"
                                name="practiceType"
                                value={formData.practiceType}
                                onChange={handleChange}
                                className="input-field"
                                required 
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
                </div>
            )}
        </div>
    );
};

export default ServiceDetailPage;
