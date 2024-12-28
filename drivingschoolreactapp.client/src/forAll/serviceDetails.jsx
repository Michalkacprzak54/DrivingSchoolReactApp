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
        manual: false,
        automatic: false,
        onlineTheory: false,
        stationaryTheory: false,
        theoryCompleted: false,
        basicPractice: false,
        extendedPractice: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Zaktualizuj formData w taki sposób, aby tylko wybrana opcja była ustawiona na true
        setFormData((prevState) => {
            // Tworzymy nowy obiekt z poprzedniego stanu
            const newFormData = { ...prevState };

            // Zresetuj odpowiednie grupy opcji
            if (name === 'manual' || name === 'automatic') {
                newFormData.manual = false;
                newFormData.automatic = false;
            }
            if (name === 'basicPractice' || name === 'extendedPractice') {
                newFormData.basicPractice = false;
                newFormData.extendedPractice = false;
            }

            if (name === 'onlineTheory' || name === 'stationaryTheory' || name === 'theoryCompleted') {
                newFormData.onlineTheory = false;
                newFormData.stationaryTheory = false;
                newFormData.theoryCompleted = false;
            }

            newFormData[name] = true; 

            return newFormData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (service.serviceType === "Kurs") {
            if (!formData.onlineTheory && !formData.stationaryTheory && !formData.theoryCompleted) {
                newErrors.theoryStatus = 'Proszę wybrać formę teorii.';  
            }
        }

        if (service.serviceType === "Kurs") {
            if (!formData.basicPractice && !formData.extendedPractice) {
                    newErrors.practiceType = 'Proszę wybrać typ praktyki.';
                
            }
        }

        if (service.serviceType === "Usługa" && !formData.manual && !formData.automatic) {
            newErrors.serviceOption = 'Proszę wybrać opcję usługi (manual/automat).';
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
                    <p><strong>Miejsce usługi:</strong> {service.servicePlace}</p>

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

                    {/* Formularz */}
                    <form onSubmit={handleSubmit} className="service-form">
                        

                        {/* Opcje praktyki */}
                        {service.serviceType === "Kurs" && (
                            <div className="input-group">
                                <div className="input-group">
                                    <label className="input-label">Typ teorii</label>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="onlineTheory"
                                                value="onlineTheory"
                                                checked={formData.onlineTheory}
                                                onChange={handleChange}
                                            />
                                            Online
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="stationaryTheory"
                                                value="stationaryTheory"
                                                checked={formData.stationaryTheory}
                                                onChange={handleChange}
                                            />
                                            Stacjonarna
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="theoryCompleted"
                                                value="theoryCompleted"
                                                checked={formData.theoryCompleted}
                                                onChange={handleChange}
                                            />
                                            Zaliczona
                                        </label>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Typ praktyki</label>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="basicPractice"
                                                value="basicPractice"
                                                checked={formData.basicPractice}
                                                onChange={handleChange}
                                            />
                                            Podstawowa
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="extendedPractice"
                                                value="extendedPractice"
                                                checked={formData.extendedPractice}
                                                onChange={handleChange}
                                            />
                                            Rozszerzona
                                        </label>
                                    </div>
                                </div>
                                {errors.theoryStatus && <p className="error-message">{errors.theoryStatus}</p>}
                                {errors.practiceType && <p className="error-message">{errors.practiceType}</p>}
                            </div>
                        )}

                        {/* Opcje usługi (manual/automat) */}
                        {service.serviceType === "Usługa" && service.servicePlace === "Praktyka" && (
                            <div className="input-group">
                                <label className="input-label">Opcja usługi</label>
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name="manual"
                                            value="manual"
                                            checked={formData.manual}
                                            onChange={handleChange}
                                        />
                                        Manual
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="automatic"
                                            value="automatic"
                                            checked={formData.automatic}
                                            onChange={handleChange}
                                        />
                                        Automat
                                    </label>
                                </div>
                                {errors.serviceOption && <p className="error-message">{errors.serviceOption}</p>}
                            </div>
                        )}

                        <button type="submit" className="add-to-cart-button">
                            Dodaj do koszyka
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ServiceDetailPage;
