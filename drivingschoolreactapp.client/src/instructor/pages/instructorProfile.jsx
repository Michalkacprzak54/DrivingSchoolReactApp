import { useEffect, useState, useContext } from 'react';
import InstructorDetails from "./instructorDetails";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from '../../utils/cookieUtils';
import { AuthContext } from '../../authContext';
import { useNavigate } from 'react-router-dom';

const InstructorProfile = () => {
    const [instructorData, setInstructorData] = useState({
        instructorEmail: '',
        instructorPassword: '',
        instructorStreet: '',
        instructorHouseNumber: '',
        instructorFlatNumber: '',
        instructorPhoneNumber: '',
        instructorCity: '',
        instructorZipCode: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const idInstructor = getCookie('instructorId');
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!isLoggedIn) {
        navigate('/login');
    }

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(idInstructor);
                setInstructorData({
                    instructorEmail: response.data.instructor.instructorEmail,
                    instructorPassword: '',
                    instructorStreet: response.data.instructorStreet,
                    instructorHouseNumber: response.data.instructorHouseNumber,
                    instructorFlatNumber: response.data.instructorFlatNumber,
                    instructorPhoneNumber: response.data.instructor.instructorPhhoneNumber,
                    instructorCity: response.data.city.cityName,
                    instructorZipCode: response.data.zipCode.zipCodeNumber
                });
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [idInstructor]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleTabChange = (tabNumber) => {
        setActiveTab(tabNumber);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                instructorEmail: instructorData.instructorEmail,
                instructorPassword: instructorData.instructorPassword,
                instructorStreet: instructorData.instructorStreet,
                instructorHouseNumber: instructorData.instructorHouseNumber,
                instructorFlatNumber: instructorData.instructorFlatNumber === "" ? null : instructorData.instructorFlatNumber,
                instructorPhoneNumber: instructorData.instructorPhoneNumber,
                instructorCity: instructorData.instructorCity,
                instructorZipCode: instructorData.instructorZipCode
            };

            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA + '/instructorEdit').update(idInstructor, updatedData);

            if (response.status === 200 || response.staus === 201 || response.staus === 204) {
                alert('Zmiany zostały zapisane!');
                setIsEditing(false);
            } else {
                alert('Błąd podczas zapisywania zmian.');
            }
        } catch (err) {
            console.error('Błąd podczas wysyłania danych:', err);
            setError(err.message || "An error occurred");
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Profil Instruktora</h2>

            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabChange(1)}>
                        Zmień email i hasło
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 2 ? 'active' : ''}`} onClick={() => handleTabChange(2)}>
                        Zmień adres
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 3 ? 'active' : ''}`} onClick={() => handleTabChange(3)}>
                        Zmień numer telefonu
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 4 ? 'active' : ''}`} onClick={() => handleTabChange(4)}>
                        Moje dane
                    </button>
                </li>
            </ul>

            <form onSubmit={handleSubmit}>
                

                {activeTab === 1 && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <label htmlFor="instructorEmail" className="form-label">Email</label>
                            <input
                                type="email"
                                id="instructorEmail"
                                name="instructorEmail"
                                className="form-control"
                                value={instructorData.instructorEmail}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorEmail: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="instructorPassword" className="form-label">Hasło</label>
                            <input
                                type="password"
                                id="instructorPassword"
                                name="instructorPassword"
                                className="form-control"
                                value={instructorData.instructorPassword}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorPassword: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <label htmlFor="instructorStreet" className="form-label">Ulica</label>
                            <input
                                type="text"
                                id="instructorStreet"
                                name="instructorStreet"
                                className="form-control"
                                value={instructorData.instructorStreet}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorStreet: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="instructorHouseNumber" className="form-label">Numer domu</label>
                            <input
                                type="text"
                                id="instructorHouseNumber"
                                name="instructorHouseNumber"
                                className="form-control"
                                value={instructorData.instructorHouseNumber}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorHouseNumber: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="instructorFlatNumber" className="form-label">Numer mieszkania</label>
                            <input
                                type="text"
                                id="instructorFlatNumber"
                                name="instructorFlatNumber"
                                className="form-control"
                                value={instructorData.instructorFlatNumber}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorFlatNumber: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="instructorCity" className="form-label">Miasto</label>
                            <input
                                type="text"
                                id="instructorCity"
                                name="instructorCity"
                                className="form-control"
                                value={instructorData.instructorCity}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorCity: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="instructorZipCode" className="form-label">Kod pocztowy</label>
                            <input
                                type="text"
                                id="instructorZipCode"
                                name="instructorZipCode"
                                className="form-control"
                                value={instructorData.instructorZipCode}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorZipCode: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 3 && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <label htmlFor="instructorPhoneNumber" className="form-label">Numer telefonu</label>
                            <input
                                type="text"
                                id="instructorPhoneNumber"
                                name="instructorPhoneNumber"
                                className="form-control"
                                value={instructorData.instructorPhoneNumber}
                                onChange={(e) => setInstructorData({ ...instructorData, instructorPhoneNumber: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                )}
                

                {activeTab === 4 && (
                    <div className="tab-content mt-3">
                        <InstructorDetails />
                    </div>
                )}

                {(activeTab === 1 || activeTab === 2 || activeTab === 3) && (
                    <div className="mt-3">
                        <button type="button" className="btn btn-secondary me-2" onClick={handleEditToggle}>
                            {isEditing ? 'Anuluj' : 'Edytuj'}
                        </button>
                        {isEditing && (
                            <button type="submit" className="btn btn-primary">Zapisz zmiany</button>
                        )}
                    </div>
                )}

            </form>
        </div>
    );
};

export default InstructorProfile;