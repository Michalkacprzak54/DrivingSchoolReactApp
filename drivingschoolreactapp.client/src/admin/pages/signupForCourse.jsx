import { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CenteredSpinner from "../../components/centeredSpinner";

function SignupForCourse() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [isAdult, setIsAdult] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT).fetchAll();
                if (response.data) {
                    const clients = response.data
                    setClients(clients);

                    
                } else {
                    setClients([]);
                }
            } catch (err) {
                console.error(err);
                setError("Błąd podczas pobierania danych klientów.");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    useEffect(() => {
        if (searchEmail.trim() === "") {
            setFilteredClients([]);
        } else {
            setFilteredClients(
                clients.filter(client => client.clientLogin?.clientEmail.toLowerCase().includes(searchEmail.toLowerCase()))
            );
        }
    }, [searchEmail, clients]);

    const handleViewDetails = (idClient) => {
        const client = clients.find(client => client.idClient === idClient);

        if (client && client.clientBirthDay) {
            const birthDate = new Date(client.clientBirthDay);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            console.log('Age:', age);
            const isAdult = age >= 18; 

            navigate(`/signUpDetails/${idClient}/${isAdult}`);
        } else {
            console.error('Nie znaleziono klienta lub brak daty urodzenia');
        }
    };


    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Lista Klientów</h2>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Wyszukaj po adresie e-mail"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
            </div>

            {loading && <CenteredSpinner />}
            {error && <p className="alert alert-danger">{error}</p>}
            {!loading && filteredClients.length === 0 && searchEmail && <p className="text-center">Brak klientów o podanym adresie e-mail.</p>}

            {!loading && filteredClients.length > 0 && (
                <table className="table table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Data urodzenia</th>
                            <th>Email</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client, index) => (
                            <tr key={client.idClient}>
                                <td>{index + 1}</td>
                                <td>{client.clientFirstName}</td>
                                <td>{client.clientLastName}</td>
                                <td>{client.clientBirthDay}</td>
                                <td>{client.clientLogin?.clientEmail || "Brak e-maila"}</td>
                                <td>
                                    <button className="btn btn-sm btn-info" onClick={() => handleViewDetails(client.idClient)}>
                                        Szczegóły
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SignupForCourse;
