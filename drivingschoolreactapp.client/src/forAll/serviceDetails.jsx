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

        setFormData((prevState) => {
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
                        <p><strong>Cena netto:</strong> {service.serviceNetPrice} zł</p>
                        <p><strong>Cena brutto:</strong> {service.serviceNetPrice * (1 + service.serviceVatRate / 100)} zł</p>
                        <p><strong>Typ usługi:</strong> {service.serviceType}</p>

                        <form onSubmit={handleSubmit} className="service-form">
                            {/* Opcje teorii */}
                            {service.serviceType === "Kurs" && (
                                <>
                                    <div className="input-group mb-5">
                                        <label className="input-label">Typ teorii</label>
                                        <div className="radio-group">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="onlineTheory"
                                                    checked={formData.onlineTheory}
                                                    onChange={handleChange}
                                                />
                                                Online
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="stationaryTheory"
                                                    checked={formData.stationaryTheory}
                                                    onChange={handleChange}
                                                />
                                                Stacjonarna
                                            </label>
                                            {/*<label>*/}
                                            {/*    <input*/}
                                            {/*        type="radio"*/}
                                            {/*        name="theoryCompleted"*/}
                                            {/*        checked={formData.theoryCompleted}*/}
                                            {/*        onChange={handleChange}*/}
                                            {/*    />*/}
                                            {/*    Zaliczona*/}
                                            {/*</label>*/}
                                        </div>
                                    </div>

                                    <div className="input-group mb-5">
                                        <label className="input-label">Typ praktyki</label>
                                        <div className="radio-group">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="basicPractice"
                                                    checked={formData.basicPractice}
                                                    onChange={handleChange}
                                                />
                                                Podstawowa
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="extendedPractice"
                                                    checked={formData.extendedPractice}
                                                    onChange={handleChange}
                                                />
                                                Rozszerzona
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Opcje usługi (manual/automat) */}
                            {service.serviceType === "Usługa" && service.servicePlace === "Praktyka" && (
                                <div className="input-group mb-5">
                                    <label className="input-label">Opcja usługi</label>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="manual"
                                                checked={formData.manual}
                                                onChange={handleChange}
                                            />
                                            Manual
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="automatic"
                                                checked={formData.automatic}
                                                onChange={handleChange}
                                            />
                                            Automat
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Błędy formularza */}
                            {errors.theoryStatus && <p className="text-danger">{errors.theoryStatus}</p>}
                            {errors.practiceType && <p className="text-danger">{errors.practiceType}</p>}
                            {errors.serviceOption && <p className="text-danger">{errors.serviceOption}</p>}

                            <button type="submit" className="btn btn-primary">
                                Dodaj do koszyka
                            </button>
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
