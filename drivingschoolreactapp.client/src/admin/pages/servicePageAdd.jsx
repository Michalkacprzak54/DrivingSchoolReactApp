import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";

function ServicePageAdd() {
    const navigate = useNavigate();

    const [serviceData, setServiceData] = useState({
        serviceName: "",
        serviceDescription: "",
        servicePrice: "",
        serviceType: "",
        servicePlace: "",
        serviceCategory: "",
        minimumAge: "",
        isPublic: false,
        variantServices: [],
        photos: []
    });


    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setServiceData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
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
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).create(serviceData);
            if (response.status === 201 || response.status === 200) {
                setSuccessMessage("Usługa została dodana!");
                setTimeout(() => navigate("/servicesPage"), 2000);
            } else {
                setError("Nie udało się dodać usługi.");
            }
        } catch (error) {
            console.error("Błąd API:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Dodaj nową usługę</h2>

            {error && <p className="alert alert-danger">{error}</p>}
            {successMessage && <p className="alert alert-success">{successMessage}</p>}

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
                            onChange={(e) => {
                                const years = parseInt(e.target.value) || 0;
                                setServiceData((prev) => ({
                                    ...prev,
                                    years,
                                    minimumAge: years + (prev.months || 0) / 12
                                }));
                            }}
                        />
                        <input
                            type="number"
                            className="form-control"
                            name="months"
                            placeholder="Miesiące"
                            min="0"
                            max="11"
                            value={serviceData.months}
                            onChange={(e) => {
                                const months = parseInt(e.target.value) || 0;
                                setServiceData((prev) => ({
                                    ...prev,
                                    months,
                                    minimumAge: prev.years + months / 12
                                }));
                            }}
                        />
                    </div>
                </div>

                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" name="isPublic" checked={serviceData.isPublic} onChange={handleChange} />
                    <label className="form-check-label">Czy usługa ma być udostępniona?</label>
                </div>


                <button type="submit" className="btn btn-primary w-100">Dodaj usługę</button>
            </form>
        </div>
    );
}

export default ServicePageAdd;
