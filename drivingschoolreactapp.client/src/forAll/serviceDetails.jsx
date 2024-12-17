import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';

function ServiceDetailPage() {
    const { idService } = useParams(); // Pobranie idService z URL
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
    }, [idService]); // Ponowne pobranie danych, jeśli idService się zmieni

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
                            <h3>Galeria zdjęć</h3>
                            <div className="photos-grid">
                                {service.photos.map((photo, index) => {
                                    const photoUrl = `/public/${photo.photoPath}`; 
                                    console.log("Link do zdjęcia:", photoUrl); // Logowanie linku do zdjęcia
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
                </div>
            )}
        </div>
    );
}

export default ServiceDetailPage;
