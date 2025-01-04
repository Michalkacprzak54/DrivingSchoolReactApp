import { useEffect, useState, useContext } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import ChangePassword from "./changePassword";
import DeleteAccount from "./deleteAccount";
import { getCookie } from '../cookieUtils';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        birthDay: '',
        phoneNumber: '',
        street: '',
        houseNumber: '',
        flatNumber: '',
        city: '',
        zipCode: ''
    });
    const [activeTab, setActiveTab] = useState("editData"); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const clientId = getCookie("userId");

    const { isLoggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    // Jeśli użytkownik nie jest zalogowany, przekierowujemy go na stronę logowania
    if (!isLoggedIn) {
        navigate('/login');
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT + '/Data').fetchById(clientId);
                setUserData(response.data);
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                firstName: userData.clientFirstName,
                lastName: userData.clientLastName,
                birthDay: userData.clientBirthDay,
                phoneNumber: userData.clientPhoneNumber,
                zipCode: userData.zipCode.zipCodeNumber,
                city: userData.city.cityName,
                street: userData.clientStreet,
                houseNumber: userData.clientHouseNumber,
                flatNumber: userData.clientFlatNumber === "" ? null : userData.clientFlatNumber
            };
            console.log("Wysyłane dane:", updatedData);

            // Wywołanie API do aktualizacji danych klienta
            await createAPIEndpoint(ENDPOINTS.CLIENT + '/Edit').update(clientId, updatedData);
            setIsEditing(false);  // Po zapisaniu danych, wyłącz tryb edycji
            alert("Dane zostały zaktualizowane");  // Powiadomienie o sukcesie
        } catch (err) {
            setError(err.message || "Błąd podczas zapisywania danych");
            console.error("Error during data update:", err); // Logowanie błędu
            alert("Błąd: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Twój Profil</h2>

            {/* Zakładki */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "editData" ? "active" : ""}`}
                        onClick={() => setActiveTab("editData")}
                    >
                        Edytuj dane
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "changePassword" ? "active" : ""}`}
                        onClick={() => setActiveTab("changePassword")}
                    >
                        Zmień hasło
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "deleteAccount" ? "active" : ""}`}
                        onClick={() => setActiveTab("deleteAccount")}
                    >
                        Usuń konto
                    </button>
                </li>
            </ul>

            {/* Treść zakładek */}
            <div className="tab-content mt-4">
                {activeTab === "editData" && (
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="clientFirstName" className="form-label">Imię</label>
                                <input
                                    type="text"
                                    id="clientFirstName"
                                    name="clientFirstName"
                                    className="form-control"
                                    value={userData.clientFirstName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="clientLastName" className="form-label">Nazwisko</label>
                                <input
                                    type="text"
                                    id="clientLastName"
                                    name="clientLastName"
                                    className="form-control"
                                    value={userData.clientLastName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="clientBirthDay" className="form-label">Data urodzenia</label>
                                <input
                                    type="date"
                                    id="clientBirthDay"
                                    name="clientBirthDay"
                                    className="form-control"
                                    value={userData.clientBirthDay}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="clientPhoneNumber" className="form-label">Numer telefonu</label>
                                <input
                                    type="text"
                                    id="clientPhoneNumber"
                                    name="clientPhoneNumber"
                                    className="form-control"
                                    value={userData.clientPhoneNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="clientStreet" className="form-label">Ulica</label>
                                <input
                                    type="text"
                                    id="clientStreet"
                                    name="clientStreet"
                                    className="form-control"
                                    value={userData.clientStreet}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="clientHouseNumber" className="form-label">Numer domu</label>
                                <input
                                    type="text"
                                    id="clientHouseNumber"
                                    name="clientHouseNumber"
                                    className="form-control"
                                    value={userData.clientHouseNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="clientFlatNumber" className="form-label">Numer mieszkania</label>
                                <input
                                    type="text"
                                    id="clientFlatNumber"
                                    name="clientFlatNumber"
                                    className="form-control"
                                    value={userData.clientFlatNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="city" className="form-label">Miasto</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="form-control"
                                    value={userData.city.cityName}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="zipCode" className="form-label">Kod pocztowy</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    className="form-control"
                                    value={userData.zipCode.zipCodeNumber}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                {isEditing ? (
                                    <>
                                        <button className="btn btn-success" onClick={handleSave}>Zapisz</button>
                                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Anuluj</button>
                                    </>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edytuj</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "changePassword" && (
                    <ChangePassword />
                )}
                {activeTab === "deleteAccount" && (
                    <DeleteAccount />
                )}
            </div>
        </div>
    );
};
export default UserProfile;
