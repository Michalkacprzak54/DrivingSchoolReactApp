import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import Calendar from 'react-calendar';
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from '../utils/cookieUtils';
import { getZonedCurrentDate } from '../utils/dateUtils';
import 'react-calendar/dist/Calendar.css';

function PracticeSchedule() {
    const [pSchedules, setPSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
    const navigate = useNavigate();
    const clientId = getCookie('userId');
    const { purchaseId } = useParams();

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
        const events = pSchedules.filter((schedule) => {
            const eventDate = new Date(schedule.date);
            return eventDate.toDateString() === date.toDateString() && eventDate >= new Date(); // Sprawdzenie, czy wydarzenie nie minęło
        });
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

    const handleSignUp = async (purchaseId, praticeScheduleId) => {
        const reservationDateFront = getZonedCurrentDate();
        const confirmed = window.confirm("Czy na pewno chcesz zapisać się na jazdy?");

        if (confirmed) {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.SERVICESCHEDULE).create({
                    idPraticeSchedule: praticeScheduleId,
                    idClientService: purchaseId,
                    reservationDate: reservationDateFront,
                    idStatus: 1
                });

                if (response.status === 201) {
                    alert("Zapisano pomyślnie!");
                    /*navigate(`/praticeInfo/${clientId}`); */
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
            {loading && <p className="text-center">Ładowanie danych...</p>}
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

            {/* Legenda */}
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
                                            onClick={() => handleSignUp(purchaseId, event.idPraticeSchedule)}
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
