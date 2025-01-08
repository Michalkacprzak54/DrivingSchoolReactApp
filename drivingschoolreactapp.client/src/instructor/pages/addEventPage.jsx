import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from '../../cookieUtils';

const Harmonogram = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [group, setGroup] = useState(''); // Pole dla grupy w teorii
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tSchedules, setTSchedules] = useState([]);
    const [practiceSchedules, setPracticeSchedules] = useState([]);
    const [instructorData, setInstructorData] = useState({});
    const [activeTab, setActiveTab] = useState('practice'); // Domyślnie zakładka praktyki
    const instructorId = getCookie('instructorId');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const instructorResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(instructorId);
                setInstructorData(instructorResponse.data.instructor);

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

        fetchData();
    }, [instructorId]);

    const isDayUnavailable = (date) => {
        const formattedDate = date.toISOString().split('T')[0];

        // Sprawdź w harmonogramie praktyki
        const isInPractice = practiceSchedules.some(
            (item) => item.date === formattedDate && item.idInstructor === Number(instructorId)
        );

        // Sprawdź w harmonogramie teorii
        const isInTheory = tSchedules.some(
            (item) => item.date === formattedDate && item.idInsctructor === Number(instructorId)
        );

        return isInPractice || isInTheory;
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedDate || !startTime || !endTime || (activeTab === 'theory' && !group)) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }

        const data = {
            date: selectedDate,
            startTime,
            endTime,
            type: activeTab === 'practice' ? 'Praktyka' : 'Teoria',
            ...(activeTab === 'theory' && { group }), // Dodaj grupę tylko dla teorii
        };

        console.log('Wysyłane dane:', data);
        // Tutaj możesz użyć fetch/axios do wysyłania danych na serwer
    };

    const validEndTimes = generateValidEndTimes(startTime, activeTab === 'practice' ? 8 : 2);

    if (loading) return <div>Ładowanie danych...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Dodaj harmonogram</h1>
            <ul className="nav nav-tabs">
                {instructorData.instructorPratice && (
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'practice' ? 'active' : ''}`}
                            onClick={() => setActiveTab('practice')}
                        >
                            Praktyka
                        </button>
                    </li>
                )}
                {instructorData.instructorTheory && (
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'theory' ? 'active' : ''}`}
                            onClick={() => setActiveTab('theory')}
                        >
                            Teoria
                        </button>
                    </li>
                )}
            </ul>
            <div className="tab-content mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Wybierz dzień</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Wybierz datę"
                            filterDate={(date) => !isDayUnavailable(date)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Godzina od</label>
                        <DatePicker
                            selected={startTime}
                            onChange={(time) => setStartTime(time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeFormat="HH:mm"
                            dateFormat="HH:mm"
                            className="form-control"
                            placeholderText="Wybierz godzinę początkową"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Godzina do</label>
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
                    {activeTab === 'theory' && (
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
                    )}
                    <button type="submit" className="btn btn-primary w-100">
                        Wyślij
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Harmonogram;
