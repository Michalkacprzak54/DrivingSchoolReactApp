import { useEffect, useState } from 'react';
import { getClients } from './services/apiService';

function ClientsPage() {
    const [clients, setClients] = useState([]); // Upewnij siê, ¿e to jest pocz¹tkowo tablica
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null); // Resetujemy b³¹d przed nowym zapytaniem

        getClients()
            .then(response => {
                console.log("Klienci:", response.data); // Sprawdzenie struktury danych
                setClients(response.data.$values); // Ustawiamy klientów z odpowiedzi
                setLoading(false);
            })
            .catch(error => {
                console.error("B³¹d podczas pobierania klientów:", error);
                setError("B³¹d pobierania danych. Spróbuj ponownie póŸniej.");
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Klienci</h2>
            {loading && <p>£adowanie danych...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {Array.isArray(clients) && clients.length > 0 ? ( // Sprawdzamy, czy 'clients' to tablica i czy ma dane
                    clients.map(client => (
                        <li key={client.idClient}>
                            {client.clientFirstName} {client.clientLastName} - {client.clientEmail}
                        </li>
                    ))
                ) : (
                    <p>Nie znaleziono klientów.</p> // Komunikat, gdy brak danych
                )}
            </ul>
        </div>
    );
}

export default ClientsPage;
