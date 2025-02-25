import { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap"; 
import CenteredSpinner from "../../components/centeredSpinner";

function ContactRequestsList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null); // Przechowuje treść wybranego zgłoszenia

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CONTACTREQUEST).fetchAll();
                if (response.data) {
                    setRequests(response.data);
                } else {
                    setRequests([]);
                }
            } catch (err) {
                setError("Błąd podczas pobierania zgłoszeń.");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const markAsResolved = async (id) => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.CONTACTREQUEST)
                .update(`resolve/${id}`, {});

            if (response.status === 200) {
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.idContactRequest === id ? { ...request, isCurrent: false } : request
                    )
                );
            } else {
                console.error("Błąd API:", response.data);
            }
        } catch (error) {
            console.error("Błąd podczas zmiany statusu zgłoszenia:", error);
        }
    };

    const pendingRequests = requests.filter((request) => request.isCurrent);
    const resolvedRequests = requests.filter((request) => !request.isCurrent);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Lista zgłoszeń</h2>

            {loading && <CenteredSpinner />}
            {error && <p className="alert alert-danger">{error}</p>}
            {!loading && requests.length === 0 && <p className="text-center">Brak zgłoszeń.</p>}

            {!loading && pendingRequests.length > 0 && (
                <>
                    <h4 className="mt-4">Oczekujące zgłoszenia</h4>
                    <table className="table table-hover table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Imię</th>
                                <th>Email</th>
                                <th>Treść zgłoszenia</th>
                                <th>Data</th>
                                <th>Akcja</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map((request, index) => (
                                <tr key={request.idContactRequest}>
                                    <td>{index + 1}</td>
                                    <td>{request.name}</td>
                                    <td>{request.email}</td>
                                    <td
                                        className="text-primary text-truncate"
                                        style={{ maxWidth: "300px", cursor: "pointer" }}
                                        onClick={() => setSelectedMessage(request.message)}
                                    >
                                        {request.message.length > 50
                                            ? request.message.substring(0, 50) + "..."
                                            : request.message}
                                    </td>
                                    <td>{new Date(request.contactDate).toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-sm btn-success" onClick={() => markAsResolved(request.idContactRequest)}>
                                            Zakończ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {!loading && resolvedRequests.length > 0 && (
                <>
                    <h4 className="mt-4">Zakończone zgłoszenia</h4>
                    <table className="table table-hover table-bordered">
                        <thead className="table-secondary">
                            <tr>
                                <th>#</th>
                                <th>Imię</th>
                                <th>Email</th>
                                <th>Treść zgłoszenia</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resolvedRequests.map((request, index) => (
                                <tr key={request.idContactRequest} className="table-success">
                                    <td>{index + 1}</td>
                                    <td>{request.name}</td>
                                    <td>{request.email}</td>
                                    <td
                                        className="text-primary text-truncate"
                                        style={{ maxWidth: "300px", cursor: "pointer" }}
                                        onClick={() => setSelectedMessage(request.message)}
                                    >
                                        {request.message.length > 50
                                            ? request.message.substring(0, 50) + "..."
                                            : request.message}
                                    </td>
                                    <td>{new Date(request.contactDate).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <Modal show={selectedMessage !== null} onHide={() => setSelectedMessage(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Pełna treść zgłoszenia</Modal.Title>
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

export default ContactRequestsList;
