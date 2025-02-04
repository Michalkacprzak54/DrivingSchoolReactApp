import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";
import CenteredSpinner from '../../components/centeredSpinner';

function ServicePageEdit() {
    const { IdService } = useParams(); // Pobranie ID usługi z URL
    const navigate = useNavigate();

    const [serviceData, setServiceData] = useState({
        serviceName: "",
        serviceDescription: "",
        servicePrice: "",
        serviceType: "",
        servicePlace: "",
        serviceCategory: "",
        years: "",
        months: "",
        minimumAge: "",
        isPublic: false
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchById(IdService);
                if (response.status === 200) {
                    const service = response.data;
                    const years = Math.floor(service.minimumAge);
                    const months = Math.round((service.minimumAge - years) * 12);

                    setServiceData({
                        idService: IdService,
                        serviceName: service.serviceName,
                        serviceDescription: service.serviceDescription,
                        servicePrice: service.servicePrice,
                        serviceType: service.serviceType,
                        servicePlace: service.servicePlace,
                        serviceCategory: service.serviceCategory,
                        years,
                        months,
                        minimumAge: service.minimumAge,
                        isPublic: service.isPublic
                    });
                } else {
                    setError("Nie udało się pobrać danych usługi.");
                }
            } catch (error) {
                console.error("Błąd pobierania danych:", error);
                setError("Błąd połączenia z serwerem.");
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [IdService]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setServiceData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleAgeChange = (e) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value) || 0;
        setServiceData((prev) => {
            const newData = { ...prev, [name]: numericValue };
            newData.minimumAge = newData.years + newData.months / 12;
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!serviceData.serviceName || !serviceData.servicePrice) {
            setError("Nazwa i cena usługi są wymagane.");
            return;
        }

        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).update(IdService, serviceData);
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                setSuccessMessage("Usługa została zaktualizowana!");
                setTimeout(() => navigate("/servicesPage"), 2000);
            } else {
                setError("Nie udało się zaktualizować usługi.");
            }
        } catch (error) {
            console.error("Błąd API:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Edytuj usługę</h2>

            {loading && <CenteredSpinner />}
            {error && <p className="alert alert-danger">{error}</p>}
            {successMessage && <p className="alert alert-success">{successMessage}</p>}

            {!loading && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nazwa usługi</label>
                        <input type="text" className="form-control" name="serviceName" value={serviceData.serviceName} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Opis usługi</label>
                        <textarea className="form-control" name="serviceDescription" value={serviceData.serviceDescription} onChange={handleChange}></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Cena (zł)</label>
                        <input type="number" className="form-control" name="servicePrice" value={serviceData.servicePrice} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Typ usługi (Kurs lub Usługa)</label>
                        <select className="form-select" name="serviceType" value={serviceData.serviceType} onChange={handleChange}>
                            <option value="">Wybierz typ usługi</option>
                            <option value="Kurs">Kurs</option>
                            <option value="Usługa">Usługa</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Praktyka czy teoria</label>
                        <select className="form-select" name="servicePlace" value={serviceData.servicePlace} onChange={handleChange}>
                            <option value="">Wybierz miejsce</option>
                            <option value="Praktyka">Praktyka</option>
                            <option value="Teoria">Teoria</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Kategoria</label>
                        <input type="text" className="form-control" name="serviceCategory" value={serviceData.serviceCategory} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Minimalny wiek</label>
                        <div className="d-flex">
                            <input
                                type="number"
                                className="form-control me-2"
                                name="years"
                                placeholder="Lata"
                                min="0"
                                value={serviceData.years}
                                onChange={handleAgeChange}
                            />
                            <input
                                type="number"
                                className="form-control"
                                name="months"
                                placeholder="Miesiące"
                                min="0"
                                max="11"
                                value={serviceData.months}
                                onChange={handleAgeChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" name="isPublic" checked={serviceData.isPublic} onChange={handleChange} />
                        <label className="form-check-label">Czy usługa ma być udostępniona?</label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Zapisz zmiany</button>
                </form>
            )}
        </div>
    );
}

export default ServicePageEdit;
