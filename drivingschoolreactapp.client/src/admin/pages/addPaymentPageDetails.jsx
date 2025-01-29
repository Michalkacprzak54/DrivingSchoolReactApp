import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { Card, Table, Button, Spinner, Alert, Form } from "react-bootstrap";

const AddPaymentPageDetails = () => {
    const { IdInvoice } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [clientServices, setClientServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInvoiceDetails(); 
    }, []);
    useEffect(() => {
        if (invoice && invoice.invoviceItems) {
            fetchClientServices(invoice.invoviceItems); 
        }
    }, [invoice]);

    const fetchInvoiceDetails = () => {
        createAPIEndpoint(ENDPOINTS.INVOICES)
            .fetchById(IdInvoice)
            .then((res) => {
                setInvoice(res.data);
            })
            .catch((err) => {
                console.error("Błąd ładowania faktury:", err);
                setError("Nie udało się załadować danych faktury.");
            })
            .finally(() => setLoading(false));
    };

    const fetchClientServices = (invoiceItems) => {
        if (!invoiceItems || invoiceItems.length === 0) return;

        console.log("invoiceItems` otrzymane z API:", invoiceItems);


        const serviceRequests = invoiceItems.map((item) => {
            return createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE + "/service").fetchById(item.idClientService);
        });

        Promise.all(serviceRequests)
            .then((responses) => {

                const services = responses.map((res) => {
                    console.log("Odpowiedź API dla usługi:", res.data);
                    return res.data;
                });

                console.log("Finalna lista usług klienta:", services);
                setClientServices(services);
            })
            .catch((err) => {
                console.error("Błąd ładowania usług klienta:", err);
                setError("Nie udało się pobrać szczegółów usług.");
            });
    };

    const handleAddPayment = () => {
        if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
            alert("Podaj prawidłową kwotę!");
            return;
        }

        const paymentData = {
            invoiceId: IdInvoice,
            amount: Number(paymentAmount),
            date: new Date().toISOString(),
        };

        createAPIEndpoint(ENDPOINTS.PAYMENTS)
            .post(paymentData)
            .then(() => {
                alert("Płatność dodana!");
                navigate("/"); // Powrót do listy faktur
            })
            .catch((err) => console.error("Błąd dodawania płatności:", err));
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Szczegóły Faktury</h2>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Ładowanie...</span>
                </Spinner>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                invoice && (
                    <Card className="p-4">
                        <Card.Body>
                            <h4>Numer faktury: {invoice.invocieNumber}</h4>
                            <p><strong>Data wystawienia:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                            <p><strong>Kwota:</strong> {invoice.fullAmount} PLN</p>
                            <p><strong>Status:</strong> {invoice.invoiceState}</p>

                            <hr />

                            <h5>Zakupione usługi</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Klient</th>
                                        <th>Usługa</th>
                                        <th>Wariant</th>
                                        <th>Ilość</th>
                                        <th>Cena jednostkowa</th>
                                        <th>Łączna kwota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientServices.map((service) => (
                                        <tr key={service.idClientService}>
                                            <td>{service.client.clientFirstName} {service.client.clientLastName}</td>
                                            <td>{service.service.serviceName}</td>
                                            <td>{service.variantService.variant}</td>
                                            <td>{service.quantity}</td>
                                            <td>{service.variantService.price} PLN</td>
                                            <td>{service.quantity * service.variantService.price} PLN</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <hr />

                            <h5>Dodaj płatność</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kwota</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleAddPayment}>
                                    Dodaj płatność
                                </Button>
                                <Button variant="secondary" className="ms-2" onClick={() => navigate("/")}>
                                    Powrót
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                )
            )}
        </div>
    );
};

export default AddPaymentPageDetails;