import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import Calendar from 'react-calendar';
import { useNavigate, useParams } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import CenteredSpinner from '../components/centeredSpinner';
import { getZonedCurrentDate } from '../utils/dateUtils';

function PracticeSchedule() {
    const [pSchedules, setPSchedules] = useState([]);
    const [userCourses, setUserCourses] = useState([]); 
    const [traineeCourses, setTraineeCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
    const navigate = useNavigate();
    const { IdCourseDetails, CategoryName } = useParams();

    // Funkcja do pobierania harmonogramu ćwiczeń
    const fetchPracticeSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES + '/category').fetchById(CategoryName);
            setPSchedules(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania harmonogramu:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };

    // Funkcja do pobierania zapisanych kursów użytkownika
    const fetchUserCourses = async () => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICE).fetchById(IdCourseDetails); 
            setUserCourses(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania zapisanych kursów:", error);
            setError("Błąd pobierania zapisanych kursów. Spróbuj ponownie później.");
        }
    };

    const fetchTraineeCourses = async () => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + '/byDetailsId').fetchById(IdCourseDetails);
            setTraineeCourses(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania kursów kursanta:", error);
            setError("Błąd pobierania kursów kursanta. Spróbuj ponownie później.");
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const events = pSchedules.filter((schedule) => new Date(schedule.date).toDateString() === date.toDateString());
        setEventsForSelectedDate(events);
    };

    useEffect(() => {
        fetchPracticeSchedules();
        fetchUserCourses(); 
        fetchTraineeCourses();
    }, []);

    const formatTime = (time) => {
        if (!time) return "Brak danych";
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    const handleSignUp = async (IdCourseDetails, praticeScheduleId, praticeDate) => {
        // Pobranie danych o kursie użytkownika
        const traineeCourse = traineeCourses[0];

        if (!traineeCourse) {
            alert("Nie znaleziono informacji o Twoim kursie.");
            return;
        }

        const totalPracticeHoursAllowed = traineeCourse.varinatService.numberPraticeHours; 
        const usedPracticeHours = traineeCourse.courseDetails.praticeHoursCount; 

        const pendingPracticeHours = userCourses.filter(course => course.idStatus === 1).length;

        if ((usedPracticeHours + pendingPracticeHours) >= totalPracticeHoursAllowed) {
            alert("Nie możesz zapisać się na więcej jazd - wykorzystałeś już wszystkie dostępne godziny.");
            return;
        }

        if (!traineeCourse.courseDetails.internalExam) {
            alert("Nie możesz zapisać się na jazdy, ponieważ nie zdałeś egzaminu wewnętrznego.");
            return;
        }

        const userPracticesOnDate = userCourses
            .filter(course => course.idStatus === 1) 
            .map(course => {
                const schedule = pSchedules.find(s => s.idPraticeSchedule === course.idPraticeSchedule);
                return schedule ? schedule.date : null;
            })
            .filter(date => date === praticeDate).length;

        if (userPracticesOnDate >= 3) {
            alert("Nie możesz zapisać się na więcej niż 3 godziny jazd dziennie.");
            return;
        }

        const formattedDate = getZonedCurrentDate();
        const confirmed = window.confirm("Czy na pewno chcesz zapisać się na jazdy?");

        if (confirmed) {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.PRATICE).create({
                    idPraticeSchedule: praticeScheduleId,
                    idCourseDetails: IdCourseDetails,
                    reservationDate: formattedDate,
                    idStatus: 1
                });

                if (response.status === 200 || response.status === 201 || response.status === 204) {
                    alert("Zapisano pomyślnie!");
                    /*navigate(`/praticeInfo/${clientId}`);*/
                    window.location.reload();   
                } else {
                    console.warn("Nieoczekiwany status odpowiedzi:", response.status);
                    alert("Błąd podczas zapisywania na jazdy. Spróbuj ponownie.");
                }
            } catch (error) {
                console.error("Błąd podczas zapisywania na jazdy:", error);
                alert("Błąd podczas zapisywania. Spróbuj ponownie.");
            }
        }
    };

    return (
        <div className="container my-5">
            <h2>Harmonogram ćwiczeń</h2>
            {loading && < CenteredSpinner />}
            {error && <p className="text-center text-danger">{error}</p>}

            <div className="d-flex justify-content-center calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={({ date }) => {
                        const eventsOnThisDay = pSchedules.filter(
                            (schedule) => new Date(schedule.date).toDateString() === date.toDateString() && new Date(schedule.date) >= new Date()
                        );
                        return eventsOnThisDay.length > 0 ? 'react-calendar__tile--event-day' : '';
                    }}
                />
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
                    {eventsForSelectedDate.filter(event => event.is_Available).length > 0 ? (
                        <ul className="list-unstyled">
                            {eventsForSelectedDate
                                .filter(event => event.is_Available) 
                                .map((event) => (
                                    <li key={event.idPraticeSchedule}>
                                        <strong>Instruktor: </strong>
                                        {event.instructor ? `${event.instructor.instructorFirstName} ${event.instructor.instructorLastName}` : "Brak danych"} <br />
                                        <strong>Data: </strong>{new Date(event.date).toLocaleDateString() || "Brak danych"} <br />
                                        <strong>Dzień: </strong>{event.dayName || "Brak danych"} <br />
                                        <strong>Godzina rozpoczęcia: </strong>{formatTime(event.startDate)} <br />
                                        <strong>Godzina zakończenia: </strong>{formatTime(event.endDate)} <br />

                                        <button
                                            className="btn btn-primary mt-2"
                                            onClick={() => handleSignUp(IdCourseDetails, event.idPraticeSchedule, event.date)}
                                        >
                                            Zapisz się
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p>Brak dostępnych wydarzeń na ten dzień.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PracticeSchedule;
