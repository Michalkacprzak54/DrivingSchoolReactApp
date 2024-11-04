import { useEffect, useState } from 'react';
import { getClients } from '../services/apiService';
import AddClientForm from './AddClientForm';

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClients();
            setClients(response.data.$values);
            setLoading(false);
        } catch (error) {
            console.error("B³¹d podczas pobierania klientów:", error);
            setError("B³¹d pobierania danych. Spróbuj ponownie póŸniej.");
            setLoading(false);
        }
    };

    const handleClientAdded = (newClient) => {
        setClients([...clients, newClient]);
    };

    return (
        <div>
            <h2>Klienci</h2>
            <AddClientForm onClientAdded={handleClientAdded} />
            {loading && <p>£adowanie danych...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {Array.isArray(clients) && clients.length > 0 ? (
                    clients.map(client => (
                        <li key={client.idClient}>
                            <strong>Imiê:</strong> {client.clientFirstName}<br />
                            <strong>Nazwisko:</strong> {client.clientLastName}<br />
                            <strong>Data urodzenia:</strong> {client.clientBirthDay}<br />
                            <strong>Numer telefonu:</strong> {client.clientPhoneNumber}<br />
                            <strong>Email:</strong> {client.clientEmail}<br />
                            <strong>Numer domu:</strong> {client.clientHouseNumber}<br />
                            <strong>Numer mieszkania:</strong> {client.clientFlatNumber}<br />
                            <strong>Status:</strong> {client.clientStatus ? 'Aktywny' : 'Nieaktywny'}<br />
                            <strong>Miasto:</strong> {client.city.cityName}<br />
                            <strong>Kod pocztowy:</strong> {client.zipCode.zipCodeNumber}
                        </li>
                    ))
                ) : (
                    <p>Nie znaleziono klientów.</p>
                )}
            </ul>
        </div>
    );
}

export default ClientsPage;
