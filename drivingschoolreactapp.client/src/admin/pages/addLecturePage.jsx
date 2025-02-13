import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AddInstructorToLecture from './AddInstructorToLecture';
import CenteredSpinner from '../../components/centeredSpinner';


const AddLecturePage = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [group, setGroup] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('schedule');
    const [tSchedules, setTSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [instructors, setInstructors] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStartDate || !startTime || !endTime || !group) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }

        const data = {
            startDate: selectedStartDate.toLocaleDateString('en-CA'),
            endDate: selectedEndDate ? selectedEndDate.toLocaleDateString('en-CA') : null,
            startTime: startTime.toLocaleTimeString('pl-PL'),
            endTime: endTime.toLocaleTimeString('pl-PL'),
            group,
            type: 'teoria',
        };

        try {
            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA + '/schedule').create(data);

            if (response.status === 200) {
                alert('Wykład został dodany pomyślnie!');
            } else {
                alert('Wystąpił problem podczas dodawania wykładu. Spróbuj ponownie.');
            }

            setSelectedStartDate(null);
            setSelectedEndDate(null);
            setStartTime(null);
            setEndTime(null);
            setGroup('');

        } catch (error) {
            alert('Wystąpił błąd podczas wysyłania danych. Spróbuj ponownie.');
            console.error("Błąd:", error);
        }
    };


    const fetchTheorySchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const [scheduleResponse, instructorResponse] = await Promise.all([
                createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchAll(),
                createAPIEndpoint(ENDPOINTS.INSTRUCTOR).fetchAll()
            ]);
            setTSchedules(scheduleResponse.data);
            setInstructors(instructorResponse.data);
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

    const handleAddInstructor = (eventId) => {
        setSelectedEventId(eventId);
    };

    const handleInstructorAssigned = () => {
        fetchTheorySchedules(); 
    };

    const getInstructorName = (id) => {
        const instructor = instructors.find(ins => ins.idInstructor === id);
        return instructor ? `${instructor.instructorFirstName} ${instructor.instructorLastName}` : 'Brak wykładowcy';
    };

    function handleLectureDelete(idTheorySchedule) {
        if (window.confirm("Czy na pewno chcesz usunąć ten wykład?")) {
            createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE)
                .delete(idTheorySchedule)
                .then(() => {
                    alert("Wykład został pomyślnie usunięty.");
                    window.location.reload();
                    fetchTheorySchedules();  
                })
                .catch((error) => {
                    console.error(`Błąd podczas usuwania wykładu:`, error);
                    alert("Wystąpił błąd podczas usuwania wykładu. Spróbuj ponownie.");
                });
        }
    }



    useEffect(() => {
        fetchTheorySchedules();
    }, []);
    const generateValidEndTimes = (start, maxHours) => {
        if (!start) return [];
        const validTimes = [];
        let currentTime = new Date(start.getTime() + 60 * 60 * 1000); 
        const maxTime = new Date(start.getTime() + maxHours * 60 * 60 * 1000); 

        while (currentTime <= maxTime) {
            validTimes.push(new Date(currentTime));
            currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000); 
        }

        return validTimes;
    };
    const validEndTimes = generateValidEndTimes(startTime, 3);

    const getEndOfWeek = (date) => {
        const dayOfWeek = date.getDay();
        const diffToFriday = (5 - dayOfWeek + 7) % 7; 
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + diffToFriday); 
        return endOfWeek;
    };

    const isWeekday = (date) => {
        const day = date.getDay();
        return day >= 1 && day <= 5;
    };

    if (loading) return <CenteredSpinner />
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-3">Zarządzaj wykładami</h2>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        Harmonogram
                    </button>
                    
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'addLecture' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addLecture')}
                    >
                        Dodaj Wykład
                    </button>
                </li>
            </ul>

            {activeTab === 'addLecture' && (
                <div>
                    <h1 className="text-center mb-4">Dodaj Wykład</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Data początkowa</label>
                            <DatePicker
                                selected={selectedStartDate}
                                onChange={(date) => setSelectedStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                                placeholderText="Wybierz datę początkową"
                                filterDate={isWeekday}
                                minDate={new Date()}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Data końcowa</label>
                            <DatePicker
                                selected={selectedEndDate}
                                onChange={(date) => setSelectedEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                                placeholderText="Wybierz datę końcową"
                                filterDate={isWeekday}
                                minDate={selectedStartDate}
                                maxDate={selectedStartDate ? getEndOfWeek(selectedStartDate) : null}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Godzina rozpoczęcia</label>
                            <DatePicker
                                selected={startTime}
                                onChange={(time) => setStartTime(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                className="form-control"
                                placeholderText="Wybierz godzinę rozpoczęcia"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Godzina zakończenia</label>
                            <select
                                className="form-select"
                                value={endTime ? endTime.getTime() : ''}
                                onChange={(e) => setEndTime(new Date(parseInt(e.target.value)))}
                            >
                                <option value="" disabled>
                                    Wybierz godzinę zakończenia
                                </option>
                                {validEndTimes.map((time) => (
                                    <option key={time.getTime()} value={time.getTime()}>
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Grupa</label>
                            <input
                                type="text"
                                className="form-control"
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                                placeholder="Wprowadź nazwę grupy"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Dodaj wykład</button>
                    </form>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="container text-center mt-4">
                    <div className="d-flex justify-content-center">
                        <div className="calendar-container">
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
                        </div>
                    </div>

                    <div className="events-container mt-4">
                        <h3>Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
                        {eventsForSelectedDate.length > 0 ? (
                            <ul className="list-unstyled">
                                {eventsForSelectedDate.map((event) => (
                                    <li key={event.idTheorySchedule}>
                                        <strong>Grupa:</strong> {event.groupName} <br />
                                        <strong>Data:</strong> {new Date(event.date).toLocaleDateString()} <br />
                                        <strong>Godzina rozpoczęcia:</strong> {event.startHour} <br />
                                        <strong>Godzina zakończenia:</strong> {event.endHour} <br />
                                        <strong>Ilość godzin</strong> {event.hourCount} <br />
                                        <strong>Wykładowca:</strong> {getInstructorName(event.idInsctructor)} <br />

                                        {(!event.idInsctructor || event.idInsctructor === null) ? (
                                            <button
                                                className="btn btn-secondary mt-2"
                                                onClick={() => handleAddInstructor(event.idTheorySchedule)}
                                            >
                                                Dodaj Wykładowcę
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-warning mt-2"
                                                onClick={() => handleAddInstructor(event.idTheorySchedule, true)}
                                            >
                                                Zmień Wykładowcę
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-danger mt-2 ms-2"
                                            onClick={() => handleLectureDelete(event.idTheorySchedule)}
                                        >
                                            Usuń Wykład
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Brak wydarzeń na ten dzień.</p>
                        )}
                    </div>
                </div>
            )}
            {selectedEventId && (
                <AddInstructorToLecture
                    eventId={selectedEventId}
                    onClose={() => setSelectedEventId(null)}
                    onInstructorAssigned={handleInstructorAssigned}
                />
            )}
        </div>
    );
};
export default AddLecturePage;