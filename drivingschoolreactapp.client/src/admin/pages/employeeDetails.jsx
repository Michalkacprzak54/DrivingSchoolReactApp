import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';
import CenteredSpinner from "../../components/centeredSpinner";


const EmployeeDetailsPage = () => {
    const { IdEmployee } = useParams();
    const [employee, setEmployee] = useState(null);
    const [entitlements, setEntitlements] = useState([]);
    const [error, setError] = useState('');
    const [showAddEntitlementForm, setShowAddEntitlementForm] = useState(false);
    const [newEntitlement, setNewEntitlement] = useState({
        idEntitlement: '', // ID wybranego uprawnienia
        dateEntitlement: '',
    });
    const [editingEntitlementId, setEditingEntitlementId] = useState(null);
    const [newValidityDate, setNewValidityDate] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const employeeResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(IdEmployee);
                setEmployee(employeeResponse.data);
            } catch (error) {
                setError('Nie udało się pobrać danych o pracowniku.');
                console.log(error);
            } finally {
                (setLoading(false));
            }
        };

        const fetchEntitlements = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.ENTITLEMENT).fetchAll();

                const instructorEntitlementIds = employee?.instructor?.instructorEntitlements?.map(
                    (entitlement) => entitlement.entitlement.idEntitlement
                );


                const availableEntitlements = response.data.filter(
                    (entitlement) => !instructorEntitlementIds?.includes(entitlement.idEntitlement)
                );

                setEntitlements(availableEntitlements);
            } catch (error) {
                console.error('Błąd podczas pobierania uprawnień:', error);
            }
        };


        fetchEmployeeDetails();
        fetchEntitlements();
    }, [IdEmployee]);

    const handleBackToList = () => {
        navigate('/employeePage');
    };

    const handleAddEntitlementClick = () => {
        setShowAddEntitlementForm(true);
    };

    const handleAddEntitlementSubmit = async (e) => {
        e.preventDefault();

        if (!newEntitlement.idEntitlement || !newEntitlement.dateEntitlement) {
            setError('Wszystkie pola muszą być wypełnione.');
            return;
        }

        try {
            await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_ENTITLEMENTS).create({
                idInstructor: IdEmployee,
                idEntitlement: parseInt(newEntitlement.idEntitlement),
                dateEntitlement: newEntitlement.dateEntitlement,
            });

            setEmployee((prev) => ({
                ...prev,
                instructor: {
                    ...prev.instructor,
                    instructorEntitlements: [
                        ...prev.instructor.instructorEntitlements,
                        {
                            entitlement: entitlements.find(
                                (entitlement) => entitlement.idEntitlement === parseInt(newEntitlement.idEntitlement)
                            ),
                            dateEntitlement: newEntitlement.dateEntitlement,
                        },
                    ],
                },
            }));

            setShowAddEntitlementForm(false);
            setNewEntitlement({ idEntitlement: '', dateEntitlement: '' });
            alert('Uprawnienie zostało pomyślnie dodane.');
        } catch (error) {
            setError('Błąd podczas dodawania uprawnienia.');
            console.log(error);
        }
    };

    const handleExtendValidity = (id) => {
        setEditingEntitlementId(id);
        setNewValidityDate(''); 
    };

    const handleExtendValiditySubmit = async (e, id) => {
        e.preventDefault();

        if (!newValidityDate) {
            setError('Proszę wprowadzić nową datę ważności.');
            return;
        }

        try {
            // Przygotowanie danych w odpowiednim formacie
            const payload = {
                IdInscrutorEntitlement: id, // id uprawnienia
                DateEntitlement: newValidityDate, // nowa data ważności
            };

            // Wysyłanie zapytania PUT do API w celu zaktualizowania daty uprawnienia
            await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_ENTITLEMENTS).update(id, payload);

            // Zaktualizuj lokalny stan
            setEmployee((prev) => ({
                ...prev,
                instructor: {
                    ...prev.instructor,
                    instructorEntitlements: prev.instructor.instructorEntitlements.map((entitlement) =>
                        entitlement.idInscrutorEntitlement === id
                            ? { ...entitlement, dateEntitlement: newValidityDate }
                            : entitlement
                    ),
                },
            }));

            setEditingEntitlementId(null);
            setNewValidityDate('');
            alert('Ważność uprawnienia została przedłużona.');
        } catch (error) {
            setError('Błąd podczas przedłużania ważności uprawnienia.');
            console.log(error);
        }
    };

    const handleDeleteEntitlement = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć to uprawnienie?')) {
            try {
                // Wysyłanie zapytania DELETE do API w celu usunięcia uprawnienia
                await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_ENTITLEMENTS).delete(id);

                // Zaktualizowanie lokalnego stanu po usunięciu uprawnienia
                setEmployee((prev) => ({
                    ...prev,
                    instructor: {
                        ...prev.instructor,
                        instructorEntitlements: prev.instructor.instructorEntitlements.filter(
                            (entitlement) => entitlement.idInscrutorEntitlement !== id
                        ),
                    },
                }));

                alert('Uprawnienie zostało usunięte.');
            } catch (error) {
                setError('Błąd podczas usuwania uprawnienia.');
                console.error(error);
            }
        }
    };



    if (loading) return <CenteredSpinner />

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Szczegóły Pracownika</h2>

            {error && <p className="text-danger">{error}</p>}

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

            {employee.instructor.instructorEntitlements && employee.instructor.instructorEntitlements.length > 0 ? (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Uprawnienia</h5>
                        <ul>
                            {employee.instructor.instructorEntitlements.map((entitlement) => (
                                <li key={entitlement.idInscrutorEntitlement}>
                                    {entitlement.entitlement.entitlementName} - Ważne do: {entitlement.dateEntitlement}
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleExtendValidity(entitlement.idInscrutorEntitlement)}
                                    >
                                        Przedłuż ważność
                                    </button>

                                    <button
                                        onClick={() => handleDeleteEntitlement(entitlement.idInscrutorEntitlement)}
                                        className="btn btn-danger ml-2"
                                    >
                                        Usuń
                                    </button>
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>
            ) : (
                <p>Brak uprawnień dla tego pracownika.</p>
            )}

            {showAddEntitlementForm && (
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Dodaj Uprawnienie</h5>
                        <form onSubmit={handleAddEntitlementSubmit}>
                            <div className="mb-3">
                                <label htmlFor="entitlementSelect" className="form-label">
                                    Wybierz uprawnienie
                                </label>
                                <select
                                    id="entitlementSelect"
                                    className="form-select"
                                    value={newEntitlement.idEntitlement}
                                    onChange={(e) =>
                                        setNewEntitlement({
                                            ...newEntitlement,
                                            idEntitlement: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">-- Wybierz uprawnienie --</option>
                                    {entitlements.map((entitlement) => (
                                        <option key={entitlement.idEntitlement} value={entitlement.idEntitlement}>
                                            {entitlement.entitlementName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="expirationDate" className="form-label">
                                    Data ważności
                                </label>
                                <input
                                    type="date"
                                    id="expirationDate"
                                    className="form-control"
                                    value={newEntitlement.dateEntitlement}
                                    onChange={(e) =>
                                        setNewEntitlement({
                                            ...newEntitlement,
                                            dateEntitlement: e.target.value,
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
                                onClick={() => setShowAddEntitlementForm(false)}
                            >
                                Anuluj
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {editingEntitlementId && (
                <form
                    onSubmit={(e) => handleExtendValiditySubmit(e, editingEntitlementId)}
                    className="mt-3"
                >
                    <label>Nowa data ważności:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={newValidityDate}
                        onChange={(e) => setNewValidityDate(e.target.value)}
                    />
                    <button type="submit" className="btn btn-success mt-2">
                        Zapisz
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary mt-2"
                        onClick={() => setEditingEntitlementId(null)}
                    >
                        Anuluj
                    </button>
                </form>
            )}

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
