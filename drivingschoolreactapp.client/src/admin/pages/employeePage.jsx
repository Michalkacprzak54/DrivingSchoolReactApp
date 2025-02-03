import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importujemy useNavigate
import { createAPIEndpoint, ENDPOINTS } from '../../api/index'; // Zakładając, że masz API do zarządzania pracownikami

const EmployeePage = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Inicjalizujemy navigate

    // Pobieranie listy pracowników
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchAll();
                setEmployees(response.data);
            } catch (error) {
                setError('Nie udało się pobrać danych o pracownikach.');
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);


    const handleDelete = async (employeeId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego pracownika?')) {
            try {
                await createAPIEndpoint(ENDPOINTS.DELETE_EMPLOYEE).delete(employeeId);
                setEmployees(employees.filter(employee => employee.id !== employeeId));
                alert('Pracownik został usunięty.');
            } catch (error) {
                alert('Wystąpił błąd podczas usuwania pracownika.');
            }
        }
    };

    // Funkcja do nawigacji do edycji pracownika
    const navigateToEditEmployee = (employeeId) => {
        navigate(`/editEmployee/${employeeId}`);
    };

    // Funkcja do nawigacji do szczegółów pracownika
    const navigateToEmployeeDetails = (employeeId) => {
        navigate(`/employeeDetails/${employeeId}`);
    };

    const navigateToEmployeeChangePassword = (employeeId) => {
        navigate(`/changePasswordEmployee/${employeeId}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Lista instruktorów</h2>

            {isLoading ? (
                <p>Ładowanie danych...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div>
                    <div className="d-flex justify-content-between mb-3">
                        <button onClick={() => navigate('/addEmployee')} className="btn btn-primary">Dodaj instruktora</button>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Email</th>
                                <th>Nr. tel</th>
                                <th>Data ur.</th>
                                <th>Miasto</th>
                                <th>Kod pocztowy</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.idInstructor}>
                                    <td>{employee.idInstructor}</td>
                                    <td>{employee.instructor.instructorFirstName}</td>
                                    <td>{employee.instructor.instructorLastName}</td>
                                    <td>{employee.instructor.instructorEmail}</td>
                                    <td>{employee.instructor.instructorPhhoneNumber}</td>
                                    <td>{employee.instructorBirthDay}</td>
                                    <td>{employee.city.cityName}</td>
                                    <td>{employee.zipCode.zipCodeNumber}</td>
                                    <td>
                                        <button
                                            onClick={() => navigateToEditEmployee(employee.idInstructor)}
                                            className="btn btn-warning btn-sm me-2">
                                            Edytuj
                                        </button>
                                        <button
                                            onClick={() => navigateToEmployeeDetails(employee.idInstructor)}
                                            className="btn btn-primary btn-sm me-2">
                                            Szczegóły
                                        </button>
                                        <button
                                            onClick={() => navigateToEmployeeChangePassword(employee.idInstructor)}
                                            className="btn btn-info btn-sm me-2">
                                            Zmień hasło
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee.idInstructor)}
                                            className="btn btn-danger btn-sm">
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeePage;
