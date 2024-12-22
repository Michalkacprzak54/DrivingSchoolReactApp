import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./calendarStyles.css";
function TheoryPage() {
    const [tSchedules, setTSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);


    const fetchTheorySchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchAll();
            setTSchedules(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania harmonogramu:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const events = tSchedules.filter((schedule) => new Date(schedule.date).toDateString() === date.toDateString());
        setEventsForSelectedDate(events);
    };

    useEffect(() => {
        fetchTheorySchedules();
    }, [])

    const formatTime = (time) => {
        if (!time) return "Brak danych";
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    return (
        <div>
            <h2>Harmonogram wykładów</h2>
            {loading && <p className="loading">Ładowanie danych...</p>}
            {error && <p className="error">{error}</p>}

            {/* Kalendarz */}
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileClassName={({ date }) => {
                    const eventsOnThisDay = tSchedules.filter(
                        (schedule) => new Date(schedule.date).toDateString() === date.toDateString()
                    );
                    return eventsOnThisDay.length > 0 ? 'react-calendar__tile--event-day' : '';
                }}
            />

            {/* Wyświetlanie wydarzeń dla wybranego dnia */}
            <div className="events-container">
                <h3>Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
                {eventsForSelectedDate.length > 0 ? (
                    <ul>
                        {eventsForSelectedDate.map((event) => (
                            <li key={event.idTheorySchedule}>
                                <strong>Grupa: </strong>{event.groupName} <br />
                                <strong>Data: </strong>{new Date(event.date).toLocaleDateString()} <br />
                                <strong>Dzień: </strong>{event.dayName} <br />
                                <strong>Godzina rozpoczęcia: </strong>{formatTime(event.startHour)} <br />
                                <strong>Godzina zakończenia: </strong>{formatTime(event.endHour)} <br />

                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Brak wydarzeń na ten dzień.</p>
                )}
            </div>
        </div>
    );
}

export default TheoryPage;