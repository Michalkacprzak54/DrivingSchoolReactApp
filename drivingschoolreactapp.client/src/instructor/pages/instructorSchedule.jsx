import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from '../../utils/cookieUtils';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CenteredSpinner from "../../components/centeredSpinner";
import { useNavigate } from "react-router-dom";

function InstructorSchedulePage() {
    const [tSchedules, setTSchedules] = useState([]);
    const [practiceSchedules, setPracticeSchedules] = useState([]);
    const [instructorData, setInstructorData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState("all");
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
    const [selectedPractice, setSelectedPractice] = useState(null);
    const [formData, setFormData] = useState({
        praticeDate: '',
        startHour: '',
        endHour: '',
    });

    const navigate = useNavigate();

    const instructorId = getCookie('instructorId');

    const fetchSchedules = async () => {
        setLoading(true);
        setError(null);

        try {
            const instructorResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(instructorId);
            setInstructorData(instructorResponse.data);

            if (activeTab === "lectures") {
                if (instructorResponse.data.instructor.instructorTheory) {
                    const theoryResponse = await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchById(instructorId);
                    setTSchedules(theoryResponse.data);
                    setPracticeSchedules([]); // Zerujemy jazdy, jeśli jesteśmy na wykładach
                }
            } else if (activeTab === "pratices") {
                if (instructorResponse.data.instructor.instructorPratice) {
                    const practiceResponse = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES + "/id").fetchById(instructorId);
                    setPracticeSchedules(practiceResponse.data);
                    setTSchedules([]); // Zerujemy wykłady, jeśli jesteśmy na jazdach
                }
            } else {
                // Pobieramy oba harmonogramy, jeśli wybrano "Wszystko"
                if (instructorResponse.data.instructor.instructorTheory) {
                    const theoryResponse = await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchById(instructorId);
                    setTSchedules(theoryResponse.data);
                }
                if (instructorResponse.data.instructor.instructorPratice) {
                    const practiceResponse = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES + "/id").fetchById(instructorId);
                    setPracticeSchedules(practiceResponse.data);
                }
            }
        } catch (error) {
            console.error("Błąd podczas pobierania harmonogramu:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };


    const getFilteredEvents = () => {
        return [...tSchedules, ...practiceSchedules].filter(event => {
            if (activeTab === "all") return true;
            if (activeTab === "lectures") return event.type === "theory";
            if (activeTab === "pratices") return event.type === "practice";
            return false;
        });
    };


    const handleDateChange = (date) => {
        setSelectedDate(date);
        const events = [
            ...tSchedules.map((schedule) => ({
                ...schedule,
                type: 'theory',
                startHour: schedule.startHour,
                endHour: schedule.endHour,
            })),
            ...practiceSchedules.map((schedule) => ({
                ...schedule,
                type: 'practice',
                startHour: schedule.startDate,
                endHour: schedule.endDate,
            }))
        ].filter((schedule) => new Date(schedule.date).toDateString() === date.toDateString());

        setEventsForSelectedDate(events);
    };

    useEffect(() => {
        fetchSchedules();
    }, [activeTab]); // Wywołuje API za każdym razem, gdy zmienia się zakładka



        
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name === 'startHour') {
                const [hours, minutes] = value.split(':');
                const newEndHour = `${String((parseInt(hours) + 1) % 24).padStart(2, '0')}:${minutes}`;
                return { ...prev, [name]: value, endHour: newEndHour };
            }

            return { ...prev, [name]: value };
        });
    };

    const handleApprovePractice = (practiceScheduleId) => {
        const practice = practiceSchedules.find((schedule) => schedule.idPraticeSchedule === practiceScheduleId);
        if (practice) {
            setSelectedPractice(practice);
            setFormData({
                praticeDate: practice.date || '',
                startHour: practice.startHour || '',
                endHour: practice.endHour || '',
            });
        }
    };

    const handleCheckAttendance = (idTheorySchedule) => {
        navigate(`/attendancePage/${idTheorySchedule}`);
    };

    const getTraineeData = async (idPraticeSchedule) => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICE + '/schedule').fetchById(idPraticeSchedule);
            if (response.data && response.data.idCourseDetails) {
                const idCourseDetails = response.data.idCourseDetails;

                navigate(`/traineePage/${idCourseDetails}/${instructorId}`);

            } else {
                console.warn("idCourseDetails not found in response data.");
            }
        } catch (error) {
            console.error("Error fetching trainee data:", error);
        }
        
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formatTime = (time) => {
            
            if (time && time.length === 5) {
                return `${time}:00`;  
            }
            return time;  
        };

        const formattedStartHour = formatTime(formData.startHour);  
        const formattedEndHour = formatTime(formData.endHour);  

        console.log("Start hour:", formattedStartHour);  
        console.log("End hour:", formattedEndHour);

        if (!selectedPractice) return;

        try {
            const formattedData = {
                praticeDate: formData.praticeDate, 
                startHour: formattedStartHour, 
                endHour: formattedEndHour, 
                idStatus: 3,
            };
            await createAPIEndpoint(ENDPOINTS.PRATICE + '/Edit').update(selectedPractice.idPraticeSchedule, formattedData);


            alert('Praktyka została zatwierdzona.');
            setSelectedPractice(null); 
            setFormData({ praticeDate: '', startHour: '', endHour: '' }); 
            fetchSchedules(); 
        } catch (error) {
            console.error("Błąd zatwierdzania praktyki:", error);
            alert('Nie udało się zatwierdzić praktyki.');
        }
    };

    const formatTime = (time) => {
        if (!time) return "Brak danych";
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };
    if (loading) return <CenteredSpinner/>;
    if (error) return <p>Błąd: {error}</p>;
    return (

        <div className="container py-5">
            <h2 className="text-center mb-4">Harmonogram</h2>

            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>Wszystko</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "lectures" ? "active" : ""}`} onClick={() => setActiveTab("lectures")}>Wykłady</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "pratices" ? "active" : ""}`} onClick={() => setActiveTab("pratices")}>Jazdy</button>
                </li>
            </ul>

            <div className="d-flex justify-content-center">
                <div className="calendar-container">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={({ date }) => {
                            const hasEvent = [...tSchedules, ...practiceSchedules].some(
                                (schedule) => new Date(schedule.date).toDateString() === date.toDateString()
                            );
                            return hasEvent ? 'react-calendar__tile--event-day' : '';
                        }}
                    />
                </div>
            </div>

            <div className="legend-container mt-4 text-center">
                <h3>Legenda</h3>
                <ul className="legend-list list-unstyled">
                    <li>
                        <span className="legend-color legend-event"></span> Dzień z wydarzeniem
                    </li>
                </ul>
            </div>

            <div className="events-container mt-4 d-flex justify-content-center">
                <div className="text-center">
                    <h3>Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
                    {eventsForSelectedDate.length > 0 ? (
                        <ul className="list-unstyled">
                            {eventsForSelectedDate.map((event) => (
                                <li key={event.idPraticeSchedule || event.idTheorySchedule}>

                                    {event.type === 'practice' && (
                                        <>
                                            <strong>Data: </strong>{new Date(event.date).toLocaleDateString()} <br />
                                            <strong>Godzina rozpoczęcia: </strong>{formatTime(event.startHour)} <br />
                                            <strong>Godzina zakończenia: </strong>{formatTime(event.endHour)} <br />
                                            {!event.is_Available ? (
                                                <>
                                                    <button
                                                        className="btn btn-primary mt-2"
                                                        onClick={() => handleApprovePractice(event.idPraticeSchedule)}
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                    <button
                                                        className="btn btn-info mt-2"
                                                        onClick={() => getTraineeData(event.idPraticeSchedule)}
                                                    >
                                                        Informacje o kursancie
                                                    </button>
                                                </>
                                            ) : (
                                                <p className="text-muted mt-2">Brak zapisanych</p>
                                            )}

                                        </>
                                    )}

                                    {event.type === 'theory' && (
                                        <>
                                            <strong>Data: </strong>{new Date(event.date).toLocaleDateString()} <br />
                                            <strong>Grupa: </strong>{event.groupName} <br />
                                            <strong>Godzina rozpoczęcia: </strong>{formatTime(event.startHour)} <br />
                                            <strong>Godzina zakończenia: </strong>{formatTime(event.endHour)} <br />
                                            {event.is_Available ? (
                                                <button
                                                    className="btn btn-primary mt-2"
                                                    onClick={() => handleCheckAttendance(event.idTheorySchedule)}
                                                >
                                                    Sprawdź obecność
                                                </button>
                                            ) : (
                                            <br>
                                            </br>)}
                                            
                                        </>
                                    )}
                                </li>
                            ))}

                        </ul>
                    ) : (
                        <p>Brak wydarzeń na ten dzień.</p>
                    )}
                </div>
            </div>

            {selectedPractice && (
                <div className="container mt-4">
                    <h3 className="mb-4">Edycja praktyki</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="praticeDate" className="form-label">Data praktyki:</label>
                            <input
                                type="date"
                                className="form-control"
                                id="praticeDate"
                                name="praticeDate"
                                value={formData.praticeDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startHour" className="form-label">Godzina rozpoczęcia:</label>
                            <input
                                type="time"
                                className="form-control"
                                id="startHour"
                                name="startHour"
                                value={formData.startHour}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endHour" className="form-label">Godzina zakończenia:</label>
                            <input
                                type="time"
                                className="form-control"
                                id="endHour"
                                name="endHour"
                                value={formData.endHour}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">Zatwierdź</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setSelectedPractice(null)}>Anuluj</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default InstructorSchedulePage;
