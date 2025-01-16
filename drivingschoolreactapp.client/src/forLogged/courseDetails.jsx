import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate } from "react-router-dom";
import { getCookie } from '../utils/cookieUtils';

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
                const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE).fetchById(clientId);
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
        return <div className="container my-5 text-center">Ładowanie...</div>;
    }

    if (error) {
        return <div className="container my-5 text-center text-danger">Błąd: {error}</div>;
    }

    const handleSignUpForTheory = () => {
        navigate('/schedule');
    };

    const handleSignUpForDriving = (courseId) => {
        navigate(`/praticeSchedule/${courseId}`);
    };

    const handleContactDetails = () => {
        navigate('/contact');
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <h2 className="text-center mb-4">Lista kursów kursanta</h2>
            {traineeCourses.length > 0 ? (
                <div className="row justify-content-center w-100">
                    {traineeCourses.map(course => (
                        <div className="col-12 col-md-8 col-lg-6 mb-4" key={course.idTraineeCourse}>
                            <div className="card shadow-lg">
                                <div className="card-body">
                                    <h5 className="card-title text-center mb-3">
                                        {course.client.clientFirstName} {course.client.clientLastName}
                                    </h5>
                                    <p><strong>Usługa:</strong> {course.service.serviceName}</p>
                                    <p><strong>Data rozpoczęcia:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
                                    <p><strong>PESEL:</strong> {course.pesel}</p>
                                    <p><strong>PKK:</strong> {course.pkk}</p>
                                    <p>
                                        <strong>Badania lekarskie:</strong> {course.medicalCheck ? 'Tak' : 'Nie'}
                                    </p>
                                    <p><strong>Zaliczone godziny teorii:</strong> {course.courseDetails.theoryHoursCount}</p>
                                    <p><strong>Zaliczone godziny praktyki:</strong> {course.courseDetails.praticeHoursCount}</p>
                                    <p>
                                        <strong>Egzamin wewnętrzny:</strong> {course.courseDetails.internalExam ? 'Tak' : 'Nie'}
                                    </p>
                                    <div className="d-flex justify-content-between mt-4">
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleSignUpForTheory}
                                        >
                                            Wykłady
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleSignUpForDriving(course.courseDetails.idCourseDetails)}
                                        >
                                            Jazdy
                                        </button>
                                        <button
                                            className="btn btn-info"
                                            onClick={handleContactDetails}
                                        >
                                            Kontakt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Nie znaleziono kursów.</p>
            )}
        </div>
    );
};

export default TraineeCoursesList;
