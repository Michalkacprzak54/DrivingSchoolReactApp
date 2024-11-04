import { useEffect, useState } from 'react';
import { getClients } from './services/apiService';

function ClientsPage() {
    const [clients, setClients] = useState([]); // Upewnij si�, �e to jest pocz�tkowo tablica
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null); // Resetujemy b��d przed nowym zapytaniem

        getClients()
            .then(response => {
                console.log("Klienci:", response.data); // Sprawdzenie struktury danych
                setClients(response.data.$values); // Ustawiamy klient�w z odpowiedzi
                setLoading(false);
            })
            .catch(error => {
                console.error("B��d podczas pobierania klient�w:", error);
                setError("B��d pobierania danych. Spr�buj ponownie p�niej.");
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Klienci</h2>
            {loading && <p>�adowanie danych...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {Array.isArray(clients) && clients.length > 0 ? ( // Sprawdzamy, czy 'clients' to tablica i czy ma dane
                    clients.map(client => (
                        <li key={client.idClient}>
                            {client.clientFirstName} {client.clientLastName} - {client.clientEmail}
                        </li>
                    ))
                ) : (
                    <p>Nie znaleziono klient�w.</p> // Komunikat, gdy brak danych
                )}
            </ul>
        </div>
    );
}

export default ClientsPage;
