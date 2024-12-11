import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../forAll/calendarStyles.css";

function PracticeSchedule() {  // Zmieniona nazwa komponentu na PracticeSchedule
    const [pSchedules, setPSchedules] = useState([]);  // Harmonogram ćwiczeń
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());  // Wybrana data
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);  // Wydarzenia na wybraną datę

    // Funkcja do pobierania harmonogramu ćwiczeń
    const fetchPracticeSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES).fetchAll();  // Pobieranie danych z API
            setPSchedules(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania harmonogramu:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };

    // Funkcja zmiany daty w kalendarzu
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const events = pSchedules.filter((schedule) => new Date(schedule.date).toDateString() === date.toDateString());
        setEventsForSelectedDate(events);
    };

    // Pobieranie danych przy załadowaniu komponentu
    useEffect(() => {
        fetchPracticeSchedules();
    }, []);

    return (
        <div>
            <h2>Harmonogram ćwiczeń</h2>
            {loading && <p className="loading">Ładowanie danych...</p>}
            {error && <p className="error">{error}</p>}

            {/* Kalendarz */}
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

            {/* Wyświetlanie wydarzeń dla wybranego dnia */}
            <div className="events-container">
                <h3>Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
                {eventsForSelectedDate.length > 0 ? (
                    <ul>
                        {eventsForSelectedDate.map((event) => (
                            <li key={event.idPracticeSchedule}>
                                <strong>Grupa: </strong>{event.groupName} <br />
                                <strong>Data: </strong>{new Date(event.date).toLocaleDateString()} <br />
                                <strong>Dzień: </strong>{event.dayName} <br />
                                <strong>Godzina rozpoczęcia: </strong>{event.startHour} <br />
                                <strong>Godzina zakończenia: </strong>{event.endHour} <br />
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

export default PracticeSchedule;  // Eksportujemy komponent o nazwie PracticeSchedule
