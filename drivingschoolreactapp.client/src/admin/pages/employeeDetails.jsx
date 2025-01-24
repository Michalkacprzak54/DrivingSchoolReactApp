import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';

const EmployeeDetailsPage = () => {
    const { IdEmployee } = useParams();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [showAddEntitlementForm, setShowAddEntitlementForm] = useState(false); // Stan do kontrolowania formularza
    const [newEntitlement, setNewEntitlement] = useState({
        entitlementName: '',
        expirationDate: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const employeeResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(IdEmployee);
                setEmployee(employeeResponse.data);
            } catch (error) {
                setError('Nie udało się pobrać danych o pracowniku.');
                console.log(error);
            }
        };

        fetchEmployeeDetails();
    }, [IdEmployee]);

    const handleBackToList = () => {
        navigate('/employeePage');
    };

    const handleAddEntitlementClick = () => {
        setShowAddEntitlementForm(true); // Pokazuje formularz po kliknięciu
    };

    const handleAddEntitlementSubmit = (e) => {
        e.preventDefault();

        // Walidacja formularza
        if (!newEntitlement.entitlementName || !newEntitlement.expirationDate) {
            setError('Wszystkie pola muszą być wypełnione.');
            return;
        }

        // Dodaj uprawnienie do listy
        const updatedEntitlements = [
            ...employee.instructor.instructorEntitlements,
            {
                entitlement: { entitlementName: newEntitlement.entitlementName },
                dateEntitlement: newEntitlement.expirationDate,
            },
        ];

        const updatedEmployee = {
            ...employee,
            instructor: {
                ...employee.instructor,
                instructorEntitlements: updatedEntitlements,
            },
        };

        // Zaktualizuj dane na serwerze (przykład, należy dostosować do konkretnego API)
        createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA)
            .update(updatedEmployee)
            .then(() => {
                setEmployee(updatedEmployee); // Zaktualizuj stan lokalny
                setShowAddEntitlementForm(false); // Ukryj formularz
                setNewEntitlement({ entitlementName: '', expirationDate: '' }); // Wyczyść formularz
            })
            .catch((error) => {
                setError('Błąd podczas dodawania uprawnienia.');
                console.log(error);
            });
    };

    if (!employee) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Szczegóły Pracownika</h2>

            {error && <p className="text-danger">{error}</p>}

            {/* Wyświetlanie danych pracownika */}
            <div className="card mb-3">
                <div className="card-body">
                    <p className="card-text">Imię: {employee.instructor.instructorFirstName}</p>
                    <p className="card-text">Nazwisko: {employee.instructor.instructorLastName}</p>
                    <p className="card-text">Email: {employee.instructor.instructorEmail}</p>
                    <p className="card-text">Telefon: {employee.instructor.instructorPhoneNumber}</p>
                    <p className="card-text">Data urodzenia: {employee.instructorBirthDay}</p>
                    <p className="card-text">Miasto: {employee.city.cityName}</p>
                    <p className="card-text">Kod pocztowy: {employee.zipCode.zipCodeNumber}</p>
                    <p className="card-text">
                        Adres: {employee.instructorStreet} {employee.instructorHouseNumber}
                        {employee.instructorFlatNumber ? ` m.${employee.instructorFlatNumber}` : ''}
                    </p>
                    <p className="card-text">PESEL: {employee.instructorPesel}</p>
                    <p className="card-text">Uprawnienia do praktyki: {employee.instructor.instructorPractice ? 'Tak' : 'Nie'}</p>
                    <p className="card-text">Uprawnienia do teorii: {employee.instructor.instructorTheory ? 'Tak' : 'Nie'}</p>
                </div>
            </div>

            {/* Wyświetlanie uprawnień */}
            {employee.instructor.instructorEntitlements && employee.instructor.instructorEntitlements.length > 0 ? (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Uprawnienia</h5>
                        <ul>
                            {employee.instructor.instructorEntitlements.map((entitlement, index) => (
                                <li key={index}>
                                    {entitlement.entitlement.entitlementName} - Ważne do: {entitlement.dateEntitlement}
                                    {/* Przycisk edycji uprawnienia */}
                                    <button className="btn btn-sm btn-warning ms-2">Edytuj</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Brak uprawnień dla tego pracownika.</p>
            )}

            {/* Formularz dodawania uprawnienia */}
            {showAddEntitlementForm && (
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Dodaj Uprawnienie</h5>
                        <form onSubmit={handleAddEntitlementSubmit}>
                            <div className="mb-3">
                                <label htmlFor="entitlementName" className="form-label">
                                    Nazwa uprawnienia
                                </label>
                                <input
                                    type="text"
                                    id="entitlementName"
                                    className="form-control"
                                    value={newEntitlement.entitlementName}
                                    onChange={(e) =>
                                        setNewEntitlement({
                                            ...newEntitlement,
                                            entitlementName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="expirationDate" className="form-label">
                                    Data ważności
                                </label>
                                <input
                                    type="date"
                                    id="expirationDate"
                                    className="form-control"
                                    value={newEntitlement.expirationDate}
                                    onChange={(e) =>
                                        setNewEntitlement({
                                            ...newEntitlement,
                                            expirationDate: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Dodaj Uprawnienie
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={() => setShowAddEntitlementForm(false)} // Ukryj formularz
                            >
                                Anuluj
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Przycisk do wyświetlenia formularza */}
            {!showAddEntitlementForm && (
                <div className="mt-3">
                    <button onClick={handleAddEntitlementClick} className="btn btn-success">
                        Dodaj Uprawnienie
                    </button>
                </div>
            )}

            <div className="mt-3">
                <button onClick={handleBackToList} className="btn btn-primary">
                    Powrót do listy pracowników
                </button>
            </div>
        </div>
    );
};

export default EmployeeDetailsPage;
