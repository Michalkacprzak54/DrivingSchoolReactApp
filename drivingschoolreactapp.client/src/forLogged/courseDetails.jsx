import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate } from "react-router-dom";
import { getCookie } from '../utils/cookieUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import CenteredSpinner from '../components/centeredSpinner';

const TraineeCoursesList = () => {
    const [traineeCourses, setTraineeCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [userLectures, setUserLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const clientId = getCookie("userId");
    const [showPesel, setShowPesel] = useState(false);
    const [showPkk, setShowPkk] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); 

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

    const fetchUserCourses = async (IdCourseDetails) => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICE).fetchById(IdCourseDetails);
            setUserCourses(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania zapisanych kursów:", error);
            setError("Błąd pobierania zapisanych kursów. Spróbuj ponownie później.");
        }
    };

    const fetchUserLectures = async (IdCourseDetails) => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.LECTURE_PRESENCE).fetchById(IdCourseDetails);
            setUserLectures(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania obecności na wykładach:", error);
            setError("Błąd pobierania obecności na wykładach. Spróbuj ponownie później.");
        }
    };

    useEffect(() => {
        if (traineeCourses.length > 0) {
            const courseId = traineeCourses[0]?.courseDetails?.idCourseDetails; 

            if (activeTab === 'practice') {
                fetchUserCourses(courseId);
            } else if (activeTab === 'theory') {
                fetchUserLectures(courseId);
            }
        }
    }, [activeTab, traineeCourses]);
    if (loading) {
        return <CenteredSpinner/>;
    }

    if (error) {
        return <div className="container my-5 text-center text-danger">Błąd: {error}</div>;
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
            {traineeCourses.length > 0 ? (
                <div className="row justify-content-center w-100">
                    {traineeCourses.map(course => (
                        <div className="col-12 col-md-10 col-lg-8 mb-5" key={course.idTraineeCourse}>
                            <div className="card shadow-lg h-100 p-4">
                                <div className="card-body">
                                    <h3 className="card-title text-center mb-4">
                                        {course.client.clientFirstName} {course.client.clientLastName}
                                    </h3>

                                    {/* Zakładki Bootstrap */}
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('info')}
                                            >
                                                Informacje
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'theory' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('theory')}
                                            >
                                                Wykłady
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'practice' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('practice')}
                                            >
                                                Jazdy
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('contact')}
                                            >
                                                Kontakt
                                            </button>
                                        </li>
                                    </ul>

                                    {/* Zawartość zakładek */}
                                    <div className="tab-content mt-4">
                                        {activeTab === 'info' && (
                                            <div>
                                                <p className="fs-5"><strong>Usługa:</strong> {course.service.serviceName}</p>
                                                <p className="fs-5"><strong>Data rozpoczęcia kursu:</strong> {new Date(course.startDate).toLocaleDateString()}</p>

                                                <p className="fs-5">
                                                    <strong>PESEL:</strong> {showPesel ? course.pesel : '**********'}
                                                    <button
                                                        onClick={() => setShowPesel(!showPesel)}
                                                        className="btn btn-primary btn-sm ms-3"
                                                    >
                                                        {showPesel ? 'Ukryj' : 'Pokaż'}
                                                    </button>
                                                </p>

                                                <p className="fs-5">
                                                    <strong>PKK:</strong> {showPkk ? course.pkk : '**********'}
                                                    <button
                                                        onClick={() => setShowPkk(!showPkk)}
                                                        className="btn btn-primary btn-sm ms-3"
                                                    >
                                                        {showPkk ? 'Ukryj' : 'Pokaż'}
                                                    </button>
                                                </p>

                                                <p className="fs-5">
                                                    <strong>Badania lekarskie:</strong> {course.medicalCheck ? 'Dostarczone' : 'Niedostarczone'}
                                                </p>
                                                {course.ParentalConsent !== undefined && (
                                                    <p className="fs-5">
                                                        <strong>Zgoda rodzica:</strong> {course.ParentalConsent ? 'Dostarczona' : 'Niedostarczona'}
                                                    </p>
                                                )}
                                                <p className="fs-5"><strong>Zaliczone godziny teorii:</strong> {course.courseDetails.theoryHoursCount} z {course.varinatService.numberTheoryHours} </p>
                                                <p className="fs-5"><strong>Zaliczone godziny praktyki:</strong> {course.courseDetails.praticeHoursCount} z {course.varinatService.numberPraticeHours} </p>
                                                <p className="fs-5">
                                                    <strong>Egzamin wewnętrzny:</strong> {course.courseDetails.internalExam ? 'Zaliczony' : 'Niezaliczony'}
                                                </p>
                                            </div>
                                        )}

                                        {activeTab === 'theory' && (
                                            <div>
                                                <h4 className="text-center">Wykłady</h4>

                                                {course.courseDetails.internalExam ? (
                                                    <div>
                                                        <p>Egzamin wewnętrzny został zaliczony. Oto Twoja historia wykładów:</p>
                                                        <ul className="list-group">
                                                            {course.courseDetails.theoryHistory && course.courseDetails.theoryHistory.length > 0 ? (
                                                                course.courseDetails.theoryHistory.map((lecture, index) => (
                                                                    <li key={index} className="list-group-item">
                                                                        <strong>{lecture.date}:</strong> {lecture.topic}
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="list-group-item">Brak historii wykładów.</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p>Tutaj możesz zobaczyć terminy wykładów i zapisać się na zajęcia.</p>
                                                        <button
                                                            className="btn btn-primary w-100"
                                                            onClick={() => navigate('/schedule')}
                                                        >
                                                            Przejdź do wykładów
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {activeTab === 'practice' && (
                                            <div>
                                                <h5 className="text-center">Jazdy</h5>
                                                {userCourses.length > 0 ? (
                                                    <ul className="list-group">
                                                        {userCourses.map((lesson, index) => (
                                                            <li key={index} className="list-group-item">
                                                                <strong>{lesson.date}:</strong> {lesson.status}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>Brak zapisanych jazd.</p>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'contact' && (
                                            <div>
                                                <h5 className="text-center">Kontakt</h5>
                                                <p>Skontaktuj się z administracją lub instruktorem.</p>
                                                <button className="btn btn-info w-100" onClick={() => navigate('/contact')}>
                                                    Przejdź do kontaktu
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center display-4">Nie znaleziono kursów.</p>
            )}
        </div>
    );
};

export default TraineeCoursesList;
