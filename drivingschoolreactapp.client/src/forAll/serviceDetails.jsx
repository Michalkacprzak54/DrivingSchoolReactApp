import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { addToCart } from './cart/cartUtils';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const convertDecimalAgeToYearsAndMonths = (decimalAge) => {
        const years = Math.floor(decimalAge); // Część całkowita to lata
        const months = Math.round((decimalAge - years) * 12); // Część dziesiętna na miesiące
        return { years, months };
    };

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

    const fetchClientData = async () => {
        if (!isLoggedIn || !userId) return; // Upewnij się, że użytkownik jest zalogowany
        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT).fetchById(userId);
            setClientData(response.data); // Zapisz dane klienta w stanie
        } catch (error) {
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
        fetchClientData();
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
