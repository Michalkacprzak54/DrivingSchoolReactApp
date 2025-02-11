import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from '../../utils/cookieUtils';
import CenteredSpinner from "../../components/centeredSpinner";

const Harmonogram = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null); 
    const [selectedEndDate, setSelectedEndDate] = useState(null); 
    const [startTime, setStartTime] = useState(null); 
    const [endTime, setEndTime] = useState(null); 
    const [group, setGroup] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tSchedules, setTSchedules] = useState([]);
    const [practiceSchedules, setPracticeSchedules] = useState([]);
    const [instructorData, setInstructorData] = useState({});
    const [activeTab, setActiveTab] = useState('practice'); 
    const idInstructor = getCookie('instructorId');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const instructorResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(idInstructor);
                setInstructorData(instructorResponse.data.instructor);

                if (instructorResponse.data.instructor.instructorTheory) {
                    const theoryResponse = await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchById(idInstructor);
                    setTSchedules(theoryResponse.data);
                }

                if (instructorResponse.data.instructor.instructorPratice) {
                    const practiceResponse = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES + '/id').fetchById(idInstructor);
                    setPracticeSchedules(practiceResponse.data);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania harmonogramu:", error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idInstructor]);

    const isDayUnavailable = (date) => {
        const formattedDate = date.toLocaleDateString('en-CA');

        
        const isInPractice = practiceSchedules.some(
            (item) => item.date === formattedDate && item.idInstructor === Number(idInstructor)
        );

        
        const isInTheory = tSchedules.some(
            (item) => item.date === formattedDate && item.idInsctructor === Number(idInstructor)
        );

        return isInPractice || isInTheory;
    };

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


    const getEndOfWeek = (date) => {
        const dayOfWeek = date.getDay();
        const diffToFriday = (5 - dayOfWeek + 7) % 7; 
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + diffToFriday); 
        return endOfWeek;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStartDate || !startTime || !endTime || (activeTab === 'theory' && !group)) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }

        const data = {
            instructorId: idInstructor,
            startDate: selectedStartDate ? selectedStartDate.toLocaleDateString('en-CA') : null, 
            endDate: selectedEndDate ? selectedEndDate.toLocaleDateString('en-CA') : null, 
            startTime: startTime ? startTime.toLocaleTimeString('pl-PL') : null, 
            endTime: endTime ? endTime.toLocaleTimeString('pl-PL') : null, 
            ...(activeTab === 'theory' && { group }), 
            type: activeTab === 'practice' ? 'praktyka' : 'teoria',
        };

        console.log('Wysyłane dane:', data);

        try {
            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA + '/schedule').create(data);

            if(response.status === 200) {
                alert('Harmonogram został dodany pomyślnie!'); 
            } else {
                alert('Wystąpił problem podczas dodawania harmonogramu. Spróbuj ponownie.'); 
            }

            // Resetowanie formularza po wysłaniu danych
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            setStartTime(null);
            setEndTime(null);
            setGroup('');
            setActiveTab('practice'); 

        } catch (error) {
            // Obsługa błędów
            alert('Wystąpił błąd podczas wysyłania danych. Spróbuj ponownie.');
            console.error("Błąd:", error);
        }
        
    };

    const validEndTimes = generateValidEndTimes(startTime, activeTab === 'practice' ? 8 : 2);

    const isWeekday = (date) => {
        const day = date.getDay();
        return day >= 1 && day <= 5;
    };

    if (loading) return <CenteredSpinner/>;
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
            </ul>
            <div className="tab-content mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Wybierz datę początkową</label>
                        <DatePicker
                            selected={selectedStartDate}
                            onChange={(date) => setSelectedStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Wybierz datę początkową"
                            filterDate={(date) => isWeekday(date) && !isDayUnavailable(date)} // Tylko dni robocze
                            minDate={new Date()}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Wybierz datę końcową</label>
                        <DatePicker
                            selected={selectedEndDate}
                            onChange={(date) => setSelectedEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Wybierz datę końcową"
                            filterDate={(date) => isWeekday(date) && !isDayUnavailable(date)} // Tylko dni robocze
                            minDate={selectedStartDate} 
                            maxDate={selectedStartDate ? getEndOfWeek(selectedStartDate) : null}
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
                    <button type="submit" className="btn btn-primary w-100">
                        Wyślij
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Harmonogram;
