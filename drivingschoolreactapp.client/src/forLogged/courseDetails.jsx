import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from '../cookieUtils';

const TraineeCoursesList = () => {
    const [traineeCourses, setTraineeCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const clientId = getCookie("userId"); 

    useEffect(() => {
        if (!clientId) {
            navigate("/login");
            return;
        }
        const fetchTraineeCourses = async () => {
            try {
                // Zmieniamy zapytanie, aby uwzględniało clientId
                const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE).fetchById(clientId);
                console.log(response.data);
                setTraineeCourses(response.data);
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchTraineeCourses();
    }, [clientId]);

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h1>Lista kursów kursanta</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID Kursu</th>
                        <th>Imię i nazwisko klienta</th>
                        <th>Usługa</th>
                        <th>Data rozpoczęcia</th>
                        <th>PESEL</th>
                        <th>PKK</th>
                        <th>Stan zdrowia</th>
                        <th>Teoria</th>
                        <th>Praktyka</th>
                        <th>Egzamin wewnętrzny</th>
                        <th>Uwagi</th>
                    </tr>
                </thead>
                <tbody>
                    {traineeCourses.map(course => (
                        <tr key={course.idTraineeCourse}>
                            <td>{course.idTraineeCourse}</td>
                            <td>{course.client.clientFirstName} {course.client.clientLastName}</td>
                            <td>{course.service.serviceName}</td>
                            <td>{course.startDate}</td>
                            <td>{course.pesel}</td>
                            <td>{course.pkk}</td>
                            <td>{course.medicalCheck ? 'Tak' : 'Nie'}</td>
                            <td>{course.courseDetails.theoryHoursCount}</td>
                            <td>{course.courseDetails.praticeHoursCount}</td>
                            <td>{course.courseDetails.internalExam ? 'Tak' : 'Nie'}</td>
                            <td>{course.courseDetails.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TraineeCoursesList;
