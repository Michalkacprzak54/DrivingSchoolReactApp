import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";
import CenteredSpinner from '../../components/centeredSpinner';
import { Modal, Button } from "react-bootstrap"; 


function ServiceList() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [selectedMessage, setSelectedMessage] = useState(null);

    const convertDecimalAgeToYearsAndMonths = (decimalAge) => {
        const years = Math.floor(decimalAge); 
        const months = Math.round((decimalAge - years) * 12); 
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
            const checkResponse = await createAPIEndpoint(ENDPOINTS.SERVICE).fetchById(`${id}/checkOrders`);

            if (checkResponse.data.purchased) {
                alert("Nie można usunąć tej usługi, ponieważ została zakupiona.");
                return;
            }

            const deleteResponse = await createAPIEndpoint(ENDPOINTS.SERVICE).delete(id);

            if (deleteResponse.status === 200 || deleteResponse.status === 204) {
                alert("Usługa została usunięta!");
                setServices((prev) => prev.filter((service) => service.idService !== id));
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

            {loading && <CenteredSpinner />}
            {error && <p className="alert alert-danger">{error}</p>}
            {!loading && services.length === 0 && <p className="text-center">Brak dostępnych usług.</p>}

            {!loading && publicServices.length > 0 && (
                <>
                    <h4 className="mt-4 text-success">Opublikowane usługi</h4>
                    <table className="table table-hover table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
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
                            {publicServices.map((service, index) => (
                                <tr key={service.idService}>
                                    <td>{index+1}</td>
                                    <td>{service.serviceName}</td>
                                    <td
                                        className="text-primary text-truncate"
                                        style={{ maxWidth: "600px", cursor: "pointer" }}
                                        onClick={() => setSelectedMessage(service.serviceDescription)}
                                    >
                                        {service.serviceDescription.length > 50
                                            ? service.serviceDescription.substring(0, 50) + "..."
                                            : service.serviceDescription}
                                    </td>
                                    <td>{service.servicePrice} zł</td>
                                    <td>{service.serviceType}</td>
                                    <td>{service.servicePlace}</td>
                                    <td>{service.serviceCategory}</td>
                                    <td>{convertDecimalAgeToYearsAndMonths(service.minimumAge)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleViewDetails(service.idService)}>
                                            Szczegóły
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

            {loading && <CenteredSpinner />}
            {error && <p className="alert alert-danger">{error}</p>}
            {!loading && services.length === 0 && <p className="text-center">Brak dostępnych usług.</p>}

            {!loading && privateServices.length > 0 && (
                <>
                    <h4 className="mt-4 text-danger">Nieopublikowane usługi</h4>
                    <table className="table table-hover table-bordered">
                        <thead className="table-warning">
                            <tr>
                                <th>#</th>
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
                            {privateServices.map((service, index) => (
                                <tr key={service.idService} className="table-danger">
                                    <td>{index + 1}</td>
                                    <td>{service.serviceName}</td>
                                    <td
                                        className="text-primary text-truncate"
                                        style={{ maxWidth: "600px", cursor: "pointer" }}
                                        onClick={() => setSelectedMessage(service.serviceDescription)}
                                    >
                                        {service.serviceDescription.length > 50
                                            ? service.serviceDescription.substring(0, 50) + "..."
                                            : service.serviceDescription}
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
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(service.idService, service.variantServices)}
                                           
                                        >
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <Modal show={selectedMessage !== null} onHide={() => setSelectedMessage(null)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Pełnay opis usługi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{selectedMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedMessage(null)}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default ServiceList;
