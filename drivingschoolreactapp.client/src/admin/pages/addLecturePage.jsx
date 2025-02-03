import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import Schedule from '../../forAll/schedule';

const AddLecturePage = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [group, setGroup] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('addLecture');

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


    const generateValidEndTimes = (start, maxHours) => {
        if (!start) return [];
        const validTimes = [];
        let currentTime = new Date(start.getTime() + 60 * 60 * 1000); // Dodaj 1 godzinę
        const maxTime = new Date(start.getTime() + maxHours * 60 * 60 * 1000); // Dodaj `maxHours` godzin

        while (currentTime <= maxTime) {
            validTimes.push(new Date(currentTime));
            currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Dodaj kolejną godzinę
        }

        return validTimes;
    };
    const validEndTimes = generateValidEndTimes(startTime, 2);

    const getEndOfWeek = (date) => {
        const dayOfWeek = date.getDay();
        const diffToFriday = (5 - dayOfWeek + 7) % 7; // Oblicz różnicę dni do piątku
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + diffToFriday); // Ustaw datę na piątek
        return endOfWeek;
    };

    const isWeekday = (date) => {
        const day = date.getDay();
        return day >= 1 && day <= 5;
    };

    if (loading) return <div>Ładowanie danych...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'addLecture' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addLecture')}
                    >
                        Dodaj Wykład
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        Harmonogram
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
                <Schedule />
            )}
        </div>
    );
};

export default AddLecturePage;
