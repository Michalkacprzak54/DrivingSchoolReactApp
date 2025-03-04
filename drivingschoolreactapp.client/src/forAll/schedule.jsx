﻿import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CenteredSpinner from '../components/CenteredSpinner';
//import './TheoryPage.css'; // Dodaj plik CSS na potrzeby stylowania

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
            if (response.data) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const filteredData = response.data.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate >= today;
                });
                setTSchedules(filteredData);
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
        const events = tSchedules.filter((schedule) => new Date(schedule.date).toDateString() === date.toDateString());
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

    if (loading) return <CenteredSpinner />;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Harmonogram wykładów</h2>

            {/* Kalendarz */}
            <div className="d-flex justify-content-center">
                <div className="calendar-container">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={({ date }) => {
                            const eventsOnThisDay = tSchedules.filter(
                                (schedule) => new Date(schedule.date).toDateString() === date.toDateString() && new Date(schedule.date) >= new Date()
                            );
                            const hasExam = eventsOnThisDay.some(event => event.internalExam);

                            if (eventsOnThisDay.length > 0) {
                                return hasExam ? 'react-calendar__tile--exam-day' : 'react-calendar__tile--event-day';
                            }
                            return '';
                        }}
                    />
                </div>
            </div>

            <div className="legend-container mt-4 text-center">
                <h3>Legenda</h3>
                <ul className="legend-list list-unstyled">
                    <li className="mb-3">
                        <span className="legend-color legend-event"></span> Wykład
                    </li>
                    <li className="mb-3">
                        <span className="legend-color legend-exam"></span>  Wykład z możliwością zaliczenia egzaminu wewnętrznego
                    </li>
                </ul>
            </div>



            {/* Wyświetlanie wydarzeń dla wybranego dnia */}
            <div className="events-container mt-4 d-flex justify-content-center">
                <div className="text-center">
                    <h3>Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
                    {eventsForSelectedDate.length > 0 ? (
                        <ul className="list-unstyled">
                            {eventsForSelectedDate.map((event) => (
                                <li key={event.idTheorySchedule} className={event.internalExam ? "exam-event" : ""}>
                                    <strong>Grupa: </strong>{event.groupName} <br />
                                    <strong>Data: </strong>{new Date(event.date).toLocaleDateString()} <br />
                                    <strong>Dzień: </strong>{event.dayName} <br />
                                    <strong>Godzina rozpoczęcia: </strong>{formatTime(event.startHour)} <br />
                                    <strong>Godzina zakończenia: </strong>{formatTime(event.endHour)} <br />
                                    <strong>Godzina </strong>{event.hourCount} z <strong>30</strong><br />
                                    {/*{event.internalExam && <span className="badge bg-danger">Egzamin wewnętrzny</span>}*/}
                                    <br />
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

export default TheoryPage;
