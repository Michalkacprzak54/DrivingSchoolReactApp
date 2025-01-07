import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from '../../cookieUtils';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function InstructorSchedulePage() {
    const [tSchedules, setTSchedules] = useState([]);
    const [practiceSchedules, setPracticeSchedules] = useState([]);
    const [instructorData, setInstructorData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
    const instructorId = getCookie('instructorId');

    const fetchTheorySchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const instructorResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(instructorId);
            setInstructorData(instructorResponse.data);

            if (instructorResponse.data.instructor.instructorTheory) {
                const theoryResponse = await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchById(instructorId);
                setTSchedules(theoryResponse.data);
            }

            if (instructorResponse.data.instructor.instructorPratice) {
                const practiceResponse = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES).fetchById(instructorId);
                setPracticeSchedules(practiceResponse.data);
                console.log(practiceResponse.data);
            }

        } catch (error) {
            console.error("Błąd podczas pobierania harmonogramu:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
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
        fetchTheorySchedules();
    }, []);

    const formatTime = (time) => {
        if (!time) return "Brak danych";
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    const getPracticeStatus = (scheduleId) => {
        const practiceEvent = practiceSchedules.find((schedule) => schedule.idPraticeSchedule === scheduleId);
        if (practiceEvent) {
            return practiceEvent.is_Available ? 'Praktyka dostępna' : 'Praktyka zarezerwowana';
        }
        return null;
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Harmonogram wykładów</h2>
            {loading && <p className="loading text-center">Ładowanie danych...</p>}
            {error && <p className="error text-center">{error}</p>}

            <div className="d-flex justify-content-center">
                <div className="calendar-container">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={({ date }) => {
                            const eventsOnThisDay = [...tSchedules, ...practiceSchedules].filter(
                                (schedule) => new Date(schedule.date).toDateString() === date.toDateString()
                            );
                            const isPracticeAvailable = getPracticeStatus(date);
                            return eventsOnThisDay.length > 0 || isPracticeAvailable ? 'react-calendar__tile--event-day' : '';
                        }}
                    />
                </div>
            </div>

            <div className="events-container mt-4 d-flex justify-content-center">
                <div className="text-center">
                    <h3>Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
                    {eventsForSelectedDate.length > 0 ? (
                        <ul className="list-unstyled">
                            {eventsForSelectedDate.map((event) => (
                                <li key={event.idPraticeSchedule || event.idTheorySchedule}>
                                    <strong>Grupa: </strong>{event.groupName} <br />
                                    <strong>Data: </strong>{new Date(event.date).toLocaleDateString()} <br />
                                    <strong>Dzień: </strong>{event.dayName} <br />
                                    <strong>Godzina rozpoczęcia: </strong>{formatTime(event.startHour)} <br />
                                    <strong>Godzina zakończenia: </strong>{formatTime(event.endHour)} <br />
                                    <strong>Typ: </strong>{event.type === 'theory' ? 'Teoria' : 'Praktyka'} <br />
                                    {event.type === 'practice' && (
                                        <>
                                            <strong>Status: </strong>{getPracticeStatus(event.idPraticeSchedule)} <br />
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
        </div>
    );
}

export default InstructorSchedulePage;
