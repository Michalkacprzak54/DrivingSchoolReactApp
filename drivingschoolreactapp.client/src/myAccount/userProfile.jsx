import { useEffect, useState, useContext } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import ChangePassword from "./changePassword";
import DeleteAccount from "./deleteAccount";
import Login from "../forAll/login";
import { getCookie } from '../utils/cookieUtils';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import CenteredSpinner from '../components/CenteredSpinner';
import regexPatterns from "../utils/regexPatterns";

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
    const clientId = getCookie("userId");
    const { isLoggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!regexPatterns.firstName.test(userData.clientFirstName)) {
            setError("Nieprawidłowy format imienia.");
            return;
        }
        if (!regexPatterns.lastName.test(userData.clientLastName)) {
            setError("Nieprawidłowy format nazwiska.");
            return;
        }
        if (!regexPatterns.phoneNumber.test(userData.clientPhoneNumber)) {
            setError("Nieprawidłowy format numeru telefonu.");
            return;
        }
        if (!regexPatterns.zipCode.test(userData.zipCode.zipCodeNumber)) {
            setError("Nieprawidłowy format kodu pocztowego.");
            return;
        }
        if (!regexPatterns.city.test(userData.city.cityName)) {
            setError("Nieprawidłowy format nazwy miasta.");
            return;
        }
        if (!regexPatterns.street.test(userData.clientStreet)) {
            setError("Nieprawidłowy format nazwy ulicy.");
            return;
        }
        if (!regexPatterns.houseNumber.test(userData.clientHouseNumber)) {
            setError("Nieprawidłowy format numeru domu.");
            return;
        }
        if (userData.clientFlatNumber && !regexPatterns.flatNumber.test(userData.clientFlatNumber)) {
            setError("Nieprawidłowy format numeru mieszkania.");
            return;
        }

        setError(null);
        handleSave();
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

            await createAPIEndpoint(ENDPOINTS.CLIENT + '/Edit').update(clientId, updatedData);
            alert("Dane zostały zaktualizowane");
        } catch (err) {
            setError(err.message || "Błąd podczas zapisywania danych");
            alert("Błąd: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <CenteredSpinner />;


    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Twój Profil</h2>
            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}
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
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                        onClick={() => setActiveTab("login")}
                    >
                        Wyloguj się
                    </button>
                </li>
            </ul>

            {/* Treść zakładek */}
            <div className="tab-content mt-4">
                {activeTab === "editData" && (
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="clientFirstName" className="form-label">Imię</label>
                                    <input
                                        type="text"
                                        id="clientFirstName"
                                        name="clientFirstName"
                                        className="form-control"
                                        value={userData.clientFirstName}
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-success">Zapisz</button>

                            </form>
                        </div>
                    </div>
                )}



                {activeTab === "changePassword" && (
                    <ChangePassword />
                )}
                {activeTab === "deleteAccount" && (
                    <DeleteAccount />
                )}
                {activeTab === "login" && (
                    <Login />
                )}

            </div>
        </div>
    );
};
export default UserProfile;
