import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
/*    const navigate = useNavigate();*/


    const fetchClients = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('jwtToken');

        // Sprawdzamy, czy token istnieje
        if (!token) {
            setError("Brak tokenu, użytkownik niezalogowany.");
            setLoading(false);
            return;
        }
        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT).fetchAll({
                headers: {
                    'Authorization': `Bearer ${token}`,  // Dodajemy token w nagłówku
                }
            }); 
            setClients(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania klientów:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClients();
    }, []);


    //const handleEditClick = (idClient) => {
    //    navigate(`/edit-client/${idClient}`);
    //};

    return (
        <div>
            <h2>Klienci</h2>
            {loading && <p>Ładowanie danych...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {Array.isArray(clients) && clients.length > 0 ? (
                    clients.map(client => (
                        <li key={client.idClient}>
                            <strong>Imię:</strong> {client.clientFirstName}<br />
                            <strong>Nazwisko:</strong> {client.clientLastName}<br />
                            <strong>Data urodzenia:</strong> {client.clientBirthDay}<br />
                            <strong>Numer telefonu:</strong> {client.clientPhoneNumber}<br />
                            <strong>Numer domu:</strong> {client.clientHouseNumber}<br />
                            <strong>Numer mieszkania:</strong> {client.clientFlatNumber}<br />
                            <strong>Status:</strong> {client.clientStatus ? 'Aktywny' : 'Nieaktywny'}<br />
                            <strong>Email:</strong> {client.clientLogin.clientEmail}<br />
                            {/*<strong>Hasło:</strong> {client.clientLogin.clientPassword }<br />*/}
                            <strong>Miasto:</strong> {client.city.cityName}<br />
                            <strong>Kod pocztowy:</strong> {client.zipCode.zipCodeNumber}
                            {/*<button onClick={() => handleEditClick(client.idClient)}>*/}
                            {/*    Edytuj*/}
                            {/*</button>*/}
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
