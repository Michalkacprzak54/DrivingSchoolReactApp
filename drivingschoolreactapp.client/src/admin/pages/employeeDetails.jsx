import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';

const EmployeeDetailsPage = () => {
    const { IdEmployee } = useParams();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
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

    if (!employee) {
        return <p>Ładowanie danych...</p>;
    }

    const handleBackToList = () => {
        navigate('/employeePage');
    };

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
                    <p className="card-text">Telefon: {employee.instructor.instructorPhhoneNumber}</p>
                    <p className="card-text">Data urodzenia: {employee.instructorBirthDay}</p>
                    <p className="card-text">Miasto: {employee.city.cityName}</p>
                    <p className="card-text">Kod pocztowy: {employee.zipCode.zipCodeNumber}</p>
                    <p className="card-text">
                        Adres: {employee.instructorStreet} {employee.instructorHouseNumber}
                        {employee.instructorFlatNumber ? ` m.${employee.instructorFlatNumber}` : ''}
                    </p>
                    <p className="card-text">PESEL: {employee.instructorPesel}</p>
                    <p className="card-text">Uprawnienia do praktyki: {employee.instructor.instructorPratice ? 'Tak' : 'Nie'}</p>
                    <p className="card-text">Uprawnienia do teorii: {employee.instructor.instructorTheory ? 'Tak' : 'Nie'}</p>
                </div>
            </div>

            {/* Wyświetlanie uprawnień */}
            {employee.instructor.instructorEntitlements && employee.instructor.instructorEntitlements.length > 0 ? (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Uprawnienia</h5>
                        <ul>
                            {employee.instructor.instructorEntitlements.map((entitlement) => (
                                <li key={entitlement.idInscrutorEntitlement}>
                                    {entitlement.entitlement.entitlementName} - Ważne do: {entitlement.dateEntitlement}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Brak uprawnień dla tego pracownika.</p>
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
