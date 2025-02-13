import { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import CenteredSpinner from "../../components/centeredSpinner";

function ClientDocumentsPage() {
    const [clients, setClients] = useState([]);
    const [documentStatus, setDocumentStatus] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + '/withoutTests')
            .fetchAll()
            .then(response => {
                setClients(response.data);
                const initialStatus = response.data.reduce((acc, client) => {
                    const age = client.client.clientBirthDay ? calculateAge(client.client.clientBirthDay) : null;
                    acc[client.client.idClient] = {
                        medicalCheck: client.medicalCheck || false,
                        parentalConsent: client.parentalConsent || false,
                        requiresParentalConsent: age !== null && age < 18
                    };
                    return acc;
                }, {});
                setDocumentStatus(initialStatus);
            })
            .catch(error => {
                console.error("Błąd pobierania klientów:", error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            })
            .finally(() => setLoading(false));
    }, []);

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleDocumentStatusChange = (id, field) => {
        setDocumentStatus(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [field]: !prevState[id][field]
            }
        }));
    };

    const submitDocumentStatus = async () => {
        const clientsToUpdate = Object.keys(documentStatus).map(id => ({
            idClient: parseInt(id, 10),
            medicalCheck: documentStatus[id].medicalCheck,
            parentalConsent: documentStatus[id].requiresParentalConsent ? documentStatus[id].parentalConsent : null
        }));

        if (clientsToUpdate.length === 0) {
            alert("Nie zaznaczono żadnych klientów.");
            return;
        }

        try {
            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + '/updateMedicalAndParentalConsent')
                .create(clientsToUpdate);

            if (response.status === 200 || response.status === 201) {
                alert("Dokumenty zostały zatwierdzone!");
                window.location.reload();
            } else {
                alert("Błąd podczas zapisywania statusu dokumentów.");
            }
        } catch (error) {
            console.error("Błąd zapisywania statusu dokumentów:", error);
            alert("Nie udało się zatwierdzić dokumentów.");
        }
    };
    if (loading) return <CenteredSpinner />;

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Zatwierdzanie Dokumentów</h2>
            {error && <p className="error text-center">{error}</p>}

            {!loading && clients.length === 0 ? (
                <p className="text-center text-muted">Brak dokumentów do zatwierdzenia.</p>
            ) : (
                <>
                    <table className="table table-bordered text-center">
                        <thead className="bg-light">
                            <tr>
                                <th>#</th>
                                <th>Imię i nazwisko</th>
                                <th>Badania lekarskie</th>
                                <th>Zgoda rodzica</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client, index) => (
                                <tr key={client.client.idClient || index}>
                                    <td>{index + 1}</td>
                                    <td>{client.client.clientFirstName} {client.client.clientLastName}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={documentStatus[client.client.idClient]?.medicalCheck || false}
                                            onChange={() => handleDocumentStatusChange(client.client.idClient, 'medicalCheck')}
                                        />
                                    </td>
                                    <td>
                                        {documentStatus[client.client.idClient]?.requiresParentalConsent ? (
                                            <input
                                                type="checkbox"
                                                checked={documentStatus[client.client.idClient]?.parentalConsent || false}
                                                onChange={() => handleDocumentStatusChange(client.client.idClient, 'parentalConsent')}
                                            />
                                        ) : (
                                            <span>Nie wymagane</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={submitDocumentStatus}>Zapisz status dokumentów</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ClientDocumentsPage;
