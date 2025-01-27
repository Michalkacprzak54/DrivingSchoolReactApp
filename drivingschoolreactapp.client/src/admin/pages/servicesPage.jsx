import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";

function ServiceList() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const convertDecimalAgeToYearsAndMonths = (decimalAge) => {
        const years = Math.floor(decimalAge); // Część całkowita to lata
        const months = Math.round((decimalAge - years) * 12); // Część dziesiętna na miesiące
        return months > 0 ? `${years} lat i ${months} miesięcy` : `${years} lat`;
    };



    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchAll();
                if (response.data) {
                    setServices(response.data);
                } else {
                    setServices([]);
                }
            } catch (err) {
                console.log(err);
                setError("Błąd podczas pobierania usług.");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    //const deleteService = async (id) => {
    //    if (!window.confirm("Czy na pewno chcesz usunąć tę usługę?")) return;

    //    try {
    //        const response = await createAPIEndpoint(ENDPOINTS.SERVICE).delete(id);
    //        if (response.status === 200) {
    //            setServices((prevServices) => prevServices.filter((service) => service.idService !== id));
    //        } else {
    //            console.error("Błąd API:", response.data);
    //        }
    //    } catch (error) {
    //        console.error("Błąd podczas usuwania usługi:", error);
    //    }
    //};

    const handleViewDetails = (id) => {
        navigate(`/servicePageDetails/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/servicePageEdit/${id}`);
    };

    const handleAddService = () => {
        navigate(`/servicePageAdd`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę usługę?")) return;

        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICE).delete(id);

            if (response.status === 200 || response.status === 204) {
                alert("Usługa została usunięta!");

                // 🔄 Aktualizacja listy usług w stanie zamiast przeładowania strony
                setServices((prevServices) => prevServices.filter((service) => service.idService !== id));
            } else {
                alert("Nie udało się usunąć usługi. Spróbuj ponownie.");
            }
        } catch (error) {
            console.error("Błąd podczas usuwania usługi:", error);
            alert("Wystąpił błąd podczas usuwania usługi.");
        }
    };



    const publicServices = services.filter((service) => service.isPublic);
    const privateServices = services.filter((service) => !service.isPublic);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Lista usług</h2>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={handleAddService}>
                    Dodaj usługę
                </button>
            </div>

            {loading && <p className="text-center">Ładowanie...</p>}
            {error && <p className="alert alert-danger">{error}</p>}
            {!loading && services.length === 0 && <p className="text-center">Brak dostępnych usług.</p>}

            {!loading && publicServices.length > 0 && (
                <>
                    <h4 className="mt-4 text-success">Opublikowane usługi</h4>
                    <table className="table table-hover table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nazwa</th>
                                <th>Opis</th>
                                <th>Cena (zł)</th>
                                <th>Typ</th>
                                <th>Miejsce</th>
                                <th>Kategoria</th>
                                <th>Minimalny wiek</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {publicServices.map((service) => (
                                <tr key={service.idService}>
                                    <td>{service.idService}</td>
                                    <td>{service.serviceName}</td>
                                    <td className="text-wrap" style={{ maxWidth: "500px" }}>
                                        {service.serviceDescription}
                                    </td>
                                    <td>{service.servicePrice} zł</td>
                                    <td>{service.serviceType}</td>
                                    <td>{service.servicePlace}</td>
                                    <td>{service.serviceCategory}</td>
                                    <td>{convertDecimalAgeToYearsAndMonths(service.minimumAge)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleViewDetails(service.idService)}>
                                            Zobacz szczegóły
                                        </button>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(service.idService)}>
                                            Edytuj
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {!loading && privateServices.length > 0 && (
                <>
                    <h4 className="mt-4 text-danger">Nieopublikowane usługi</h4>
                    <table className="table table-hover table-bordered">
                        <thead className="table-warning">
                            <tr>
                                <th>ID</th>
                                <th>Nazwa</th>
                                <th>Opis</th>
                                <th>Cena (zł)</th>
                                <th>Typ</th>
                                <th>Miejsce</th>
                                <th>Kategoria</th>
                                <th>Minimalny wiek</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {privateServices.map((service) => (
                                <tr key={service.idService} className="table-danger">
                                    <td>{service.idService}</td>
                                    <td>{service.serviceName}</td>
                                    <td className="text-wrap" style={{ maxWidth: "500px" }}>
                                        {service.serviceDescription}
                                    </td>
                                    <td>{service.servicePrice} zł</td>
                                    <td>{service.serviceType}</td>
                                    <td>{service.servicePlace}</td>
                                    <td>{service.serviceCategory}</td>
                                    <td>{convertDecimalAgeToYearsAndMonths(service.minimumAge)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleViewDetails(service.idService)}>
                                            Zobacz szczegóły
                                        </button>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(service.idService)}>
                                            Edytuj
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(service.idService)}>
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default ServiceList;
