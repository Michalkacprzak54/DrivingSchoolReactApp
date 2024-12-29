import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function PracticeSchedule() {
    const [pSchedules, setPSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

    // Funkcja do pobierania harmonogramu ćwiczeń
    const fetchPracticeSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES).fetchAll();
            setPSchedules(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania harmonogramu:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const events = pSchedules.filter((schedule) => new Date(schedule.date).toDateString() === date.toDateString());
        setEventsForSelectedDate(events);
    };

    useEffect(() => {
        fetchPracticeSchedules();
    }, []);

    const formatTime = (time) => {
        if (!time) return "Brak danych";
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    return (
        <div className="container my-5">
            <h2>Harmonogram ćwiczeń</h2>
            {loading && <p className="text-center">Ładowanie danych...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            <div className="d-flex justify-content-center calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={({ date }) => {
                        const eventsOnThisDay = pSchedules.filter(
                            (schedule) => new Date(schedule.date).toDateString() === date.toDateString()
                        );
                        return eventsOnThisDay.length > 0 ? 'react-calendar__tile--event-day' : '';
                    }}
                />
            </div>

            <div className="events-container mt-4 d-flex justify-content-center">
                <div className="text-center">
                    <h3>Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
                    {eventsForSelectedDate.length > 0 ? (
                        <ul className="list-unstyled">
                            {eventsForSelectedDate.map((event) => (
                                <li key={event.idPraticeSchedule}>
                                    <strong>Data: </strong>{new Date(event.date).toLocaleDateString() || "Brak danych"} <br />
                                    <strong>Dzień: </strong>{event.dayName || "Brak danych"} <br />
                                    <strong>Godzina rozpoczęcia: </strong>{formatTime(event.startDate)} <br />
                                    <strong>Godzina zakończenia: </strong>{formatTime(event.endDate)} <br />
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

export default PracticeSchedule;
