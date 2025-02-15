import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate } from "react-router-dom";
import { getCookie } from '../utils/cookieUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import CenteredSpinner from '../components/centeredSpinner';

const TraineeCoursesList = () => {
    const [traineeCourses, setTraineeCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [userCourses, setUserCourses] = useState([]);
    const [userLectures, setUserLectures] = useState([]);
    const [praticeSchedules, setPraticeSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const clientId = getCookie("userId");
    const [showPesel, setShowPesel] = useState(false);
    const [showPkk, setShowPkk] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); 
    const [subTab, setSubTab] = useState('info'); 


    useEffect(() => {
        if (!clientId) {
            navigate("/login");
            return;
        }
        const fetchTraineeCourses = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE).fetchById(clientId);
                setTraineeCourses(response.data);
                if (response.data.length > 0) {
                    setSelectedCourse(response.data[0]); 
                }
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
            const praticeScheduleResponse = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES).fetchAll();
            setPraticeSchedules(praticeScheduleResponse.data);
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

    const cancelLesson = async (idPratice) => {
        try {
            await createAPIEndpoint(ENDPOINTS.PRATICE).delete(idPratice);
            setUserCourses(prevCourses => prevCourses.filter(course => course.idPratice !== idPratice));
            alert("Jazda została anulowana.");
        } catch (error) {
            console.error("Błąd podczas anulowania jazdy:", error);
            setError("Błąd anulowania jazdy. Spróbuj ponownie później.");
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
                                                            {userLectures.length > 0 ? (
                                                                userLectures.map((lecture, index) => (
                                                                    <li key={lecture.idLecturePresence} className="list-group-item">
                                                                        <strong>{ index +1 } h</strong> 
                                                                        <strong>Data:</strong> {new Date(lecture.presanceDate).toLocaleDateString()}
                                                                        <br />
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
                                                <h4 className="text-center">Jazdy</h4>
                                                {/*<div className="text-center mb-3">*/}
                                                {/*    <button className="btn btn-primary" onClick={() => navigate(`/serviceSchedule`)}>*/}
                                                {/*        Przejdź do harmonogramu usług*/}
                                                {/*    </button>*/}
                                                {/*</div>*/}
                                                {/* Zakładki wewnętrzne */}
                                                <ul className="nav nav-tabs">
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${subTab === 'active' ? 'active' : ''}`}
                                                            onClick={() => setSubTab('active')}
                                                        >
                                                            Zaplanowane jazdy
                                                        </button>
                                                    </li>
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${subTab === 'completed' ? 'active' : ''}`}
                                                            onClick={() => setSubTab('completed')}
                                                        >
                                                            Odbyte jazdy
                                                        </button>
                                                    </li>
                                                </ul>

                                                <div className="tab-content mt-3">
                                                    {/* Aktywne jazdy */}
                                                    {subTab === 'active' && (
                                                        <div>
                                                            {userCourses.filter(lesson => lesson.idStatus === 1).length > 0 ? (
                                                                <ul className="list-group">
                                                                    {userCourses.filter(lesson => lesson.idStatus === 1).map((lesson) => {
                                                                        const schedule = praticeSchedules.find(s => s.idPraticeSchedule === lesson.idPraticeSchedule);

                                                                        return (
                                                                            <li key={lesson.idPratice} className="list-group-item d-flex flex-column p-3 shadow-sm rounded">
                                                                                <div className="d-flex justify-content-between align-items-center">
                                                                                    <h5 className="mb-1">Jazda praktyczna</h5>
                                                                                    <span className="badge bg-success">Aktywna</span>
                                                                                </div>
                                                                                <p className="mb-1"><strong>Data rezerwacji:</strong> {new Date(lesson.reservationDate).toLocaleString()}</p>
                                                                                <p className="mb-1"><strong>Data praktyk:</strong> {schedule ? `${schedule.date} ${schedule.dayName.charAt(0).toUpperCase() + schedule.dayName.slice(1)}` : 'Nieznana'}</p>
                                                                                <p className="mb-1"><strong>Godzina:</strong> {schedule ? `${schedule.startDate} - ${schedule.endDate}` : 'Nieznana'}</p>
                                                                                <p className="mb-1"><strong>Instruktor:</strong> {schedule?.instructor ? `${schedule.instructor.instructorFirstName} ${schedule.instructor.instructorLastName}` : 'Nieznany'}</p>
                                                                                <button className="btn btn-danger mt-2" onClick={() => cancelLesson(lesson.idPratice)}>Anuluj jazdę</button>
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            ) : (

                                                                <p className="text-center">Brak aktywnych jazd.</p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Odbyte jazdy */}
                                                    {subTab === 'completed' && (
                                                        <div>
                                                            {userCourses.filter(lesson => lesson.idStatus === 3).length > 0 ? (
                                                                <ul className="list-group">
                                                                    {userCourses.filter(lesson => lesson.idStatus === 3).map((lesson) => {
                                                                        const schedule = praticeSchedules.find(s => s.idPraticeSchedule === lesson.idPraticeSchedule);

                                                                        return (
                                                                            <li key={lesson.idPratice} className="list-group-item">
                                                                                <strong>Data rezerwacji:</strong> {new Date(lesson.reservationDate).toLocaleString()}
                                                                                <br />
                                                                                <strong>Data praktyk:</strong> {schedule ? `${schedule.date} ${schedule.dayName.charAt(0).toUpperCase() + schedule.dayName.slice(1)}` : 'Nieznana'}
                                                                                <br />
                                                                                <strong>Godzina:</strong> {schedule ? `${schedule.startDate} - ${schedule.endDate}` : 'Nieznana'}
                                                                                <br />
                                                                                <strong>Instruktor:</strong> {schedule?.instructor ? `${schedule.instructor.instructorFirstName} ${schedule.instructor.instructorLastName}` : 'Nieznany'}
                                                                                <br />
                                                                                <strong>Status:</strong> Odbyta
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            ) : (
                                                                <p className="text-center">Brak odbytych jazd.</p>
                                                            )}
                                                        </div>
                                                    )}

                                                </div>
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
