import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";

function ClientPage() {
    const { idClientService, instructorId } = useParams();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE + "/service").fetchById(idClientService);

                if (response.data) {
                    setClientData(response.data);
                } else {
                    setError("Nie znaleziono danych klienta.");
                }
            } catch (err) {
                console.error("Błąd pobierania danych klienta:", err);
                setError("Wystąpił błąd podczas pobierania danych.");
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [idClientService]);

    const formatDate = (dateString) => {
        if (!dateString) return "Brak danych";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="container py-5">

            <div className="d-flex justify-content-start mb-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/instructorSchedule`)}
                >
                    Powrót do harmonogramu
                </button>
            </div>
            <h2 className="text-center mb-4">Dane Klienta</h2>

            {loading && <p className="text-center">Ładowanie danych...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {clientData && (

                <div className="card mx-auto p-4" style={{ maxWidth: "600px" }}>
                    <h4>Informacje o Kliencie</h4>
                    <p><strong>Imię i nazwisko:</strong> {clientData.client.clientFirstName} {clientData.client.clientLastName}</p>              

                    <hr />
                    <h4>Usługa</h4>
                    <p><strong>Usługa:</strong> {clientData.service.serviceName}</p>
                    <p><strong>Opis:</strong> {clientData.variantService.variant}</p>
                    <p><strong>Liczba godzin teorii:</strong> {clientData.variantService.numberTheoryHours}</p>
                    <p><strong>Liczba godzin praktyki:</strong> {clientData.variantService.numberPraticeHours}</p>

                    <hr />
                    <h4>Szczegóły Zakupu</h4>
                    <p><strong>Data zakupu:</strong> {formatDate(clientData.purchaseDate)}</p>
                    <p><strong>Ilość zakupiona:</strong> {clientData.quantity}</p>
                    <p><strong>Ilość wykorzystana:</strong> {clientData.howManyUsed} / {clientData.quantity}</p>
                </div>
            )}
        </div>
    );
}

export default ClientPage;
