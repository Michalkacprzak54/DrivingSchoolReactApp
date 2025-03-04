﻿import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { addToCart } from './cart/cartUtils';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import CenteredSpinner from '../components/CenteredSpinner';
import { formatDescription } from '../utils/textFormat';

function ServiceDetailPage() {
    const { idService } = useParams(); 
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ selectedVariant: '' });
    const { isLoggedIn, userId } = useContext(AuthContext); 
    const [clientData, setClientData] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null); 
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const navigate = useNavigate();

    const changePhoto = (index) => {
        setCurrentPhotoIndex(index);
    }

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
            years--;
            months += 12; 
        }

        if (today.getDate() < birth.getDate()) {
            months--;
        }

        return { years, months };
    };

    const convertDecimalAgeToYearsAndMonths = (decimalAge) => {
        const years = Math.floor(decimalAge); 
        const months = Math.round((decimalAge - years) * 12); 
        return { years, months };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        const selectedVariant = service.variantServices.find(
            (variant) => variant.idVariantService === parseInt(value, 10)
        );
        setSelectedPrice(selectedVariant ? selectedVariant.price : service.servicePrice);
    };

    const fetchClientData = async () => {
        if (!isLoggedIn || !userId) return; 
        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT).fetchById(userId);
            setClientData(response.data);         } catch (error) {
            console.error("Błąd pobierania danych klienta:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        

        if (!formData.selectedVariant) {
            newErrors.variant = 'Proszę wybrać jeden z dostępnych wariantów.';
        }

        if (clientData && service) {
            const clientAge = calculateAge(clientData.clientBirthDay);
            if (clientAge < service.minimumAge) {
                const { years, months } = convertDecimalAgeToYearsAndMonths(service.minimumAge);
                alert(`Minimalny wiek wymagany do zakupu tej usługi to ${years} lat i ${months} miesięcy.`);
                newErrors.age = `Minimalny wiek wymagany do zakupu tej usługi to ${years} lat i ${months} miesięcy.`;

            }
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (!isLoggedIn) {
            alert("Musisz być zalogowany, aby dodać usługę do koszyka.");
            navigate('/login');
            return;
        }

        setErrors({});
        addToCart(service, formData);
    };

    const fetchServiceDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchById(idService);
            setService(response.data);
            setSelectedPrice(response.data.servicePrice); 
        } catch (error) {
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchServiceDetails();
        fetchClientData();
    }, [idService]);

    if (loading) return <CenteredSpinner />;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="service-detail-page container py-5">
            <button onClick={() => navigate('/services')} className="btn btn-primary mb-3">Powrót</button>
            {service && (
                <div className="row">
                    <div className="col-lg-8">
                        <h2>{service.serviceName}</h2>
                        <p
                            className="card-text text-break"
                            style={{ whiteSpace: "pre-line" }}
                            dangerouslySetInnerHTML={{ __html: formatDescription(service.serviceDescription) }}
                        ></p>

                        <p>
                            <strong>Cena brutto:</strong>{' '}
                            {selectedPrice !== null ? `${selectedPrice} zł` : `${service.servicePrice} zł`}
                        </p>
                        <p><strong>Typ usługi:</strong> {service.serviceType}</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="variantSelect"><strong>Wybierz wariant:</strong></label>
                                <select
                                    id="variantSelect"
                                    name="selectedVariant"
                                    className="form-control"
                                    value={formData.selectedVariant}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Wybierz wariant --</option>
                                    {service.variantServices
                                        .filter(variant => variant.isPublished)
                                        .map((variant) => (
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

                            <button type="submit" className="btn btn-primary w-100">Dodaj do koszyka</button>
                        </form>
                    </div>

                    <div className="col-lg-4">
                        {service.photos && service.photos.length > 0 ? (
                            <div className="photo-container text-center">
                                <div className="photo-wrapper mb-3">
                                    <img
                                        src={`/public/${service.photos[currentPhotoIndex].photoPath}`}
                                        alt={service.photos[currentPhotoIndex].alternativeDescription || "Zdjęcie usługi"}
                                        className="img-fluid w-100"
                                        style={{
                                            maxHeight: "600px",  
                                            maxWidth: "800px",
                                            objectFit: "cover",
                                            borderRadius: "10px"
                                        }}
                                    />
                                </div>

                                <div className="thumbnail-container d-flex justify-content-center">
                                    {service.photos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={`/public/${photo.photoPath}`}
                                            alt={photo.alternativeDescription || "Miniatura"}
                                            className={`thumbnail-img mx-1 ${index === currentPhotoIndex ? 'border border-primary' : ''}`}
                                            style={{
                                                width: "80px", 
                                                height: "80px",
                                                objectFit: "cover",
                                                cursor: "pointer",
                                                borderRadius: "5px",
                                                opacity: index === currentPhotoIndex ? "1" : "0.6"
                                            }}
                                            onClick={() => changePhoto(index)}
                                        />
                                    ))}
                                </div>
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
