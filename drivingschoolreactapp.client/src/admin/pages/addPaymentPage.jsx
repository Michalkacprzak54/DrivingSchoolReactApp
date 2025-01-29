import { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = () => {
        setLoading(true);
        createAPIEndpoint(ENDPOINTS.INVOICES)
            .fetchAll()
            .then((res) => {
                const filteredInvoices = res.data.filter(
                    (invoice) => invoice.invoiceState === "wystawiona" && (!invoice.payments || invoice.payments.length === 0)
                );
                setInvoices(filteredInvoices);
            })
            .catch((err) => console.error("Błąd ładowania faktur:", err))
            .finally(() => setLoading(false));
    };

    const handleDetails = (invoiceId) => {
        navigate(`/addPaymentPageDetails/${invoiceId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Lista faktur</h2>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Ładowanie...</span>
                </Spinner>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Numer Faktury</th>
                            <th>Data Wystawienia</th>
                            <th>Kwota</th>
                            <th>Status</th>
                            <th>Akcje</th>

                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, index) => (
                            <tr key={invoice.idInvocie}>
                                <td>{index + 1}</td>
                                <td>{invoice.invocieNumber}</td>
                                <td>{new Date(invoice.issueDate).toLocaleDateString()}</td>
                                <td>{invoice.fullAmount} PLN</td>
                                <td>{invoice.invoiceState}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleDetails(invoice.idInvocie)}>
                                        Zobacz szczegóły
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default InvoiceTable;
