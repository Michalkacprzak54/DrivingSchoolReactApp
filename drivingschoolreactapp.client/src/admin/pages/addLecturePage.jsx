import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";

const AddLecturePage = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [group, setGroup] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allInstructors, setAllInstructors] = useState([]);
    const [selectedInstructorId, setSelectedInstructorId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const allInstructorsResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR).fetchAll();
                const filteredInstructors = allInstructorsResponse.data.filter(instructor => instructor.instructorTheory);
                setAllInstructors(filteredInstructors);
            } catch (error) {
                console.error("Błąd podczas pobierania danych o instruktorach:", error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedInstructorId || !selectedStartDate || !startTime || !endTime || !group) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }

        const data = {
            instructorId: selectedInstructorId,
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

            setSelectedInstructorId(null);
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

    const isWeekday = (date) => {
        const day = date.getDay();
        return day >= 1 && day <= 5;
    };

    if (loading) return <div>Ładowanie danych...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Dodaj Wykład</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Wybierz instruktora</label>
                    <select
                        className="form-select"
                        value={selectedInstructorId || ''}
                        onChange={(e) => setSelectedInstructorId(e.target.value)}
                    >
                        <option value="" disabled>Wybierz instruktora</option>
                        {allInstructors.map((instructor) => (
                            <option key={instructor.idInstructor} value={instructor.idInstructor}>
                                {instructor.instructorFirstName} {instructor.instructorLastName}
                            </option>
                        ))}
                    </select>
                </div>
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
                    <DatePicker
                        selected={endTime}
                        onChange={(time) => setEndTime(time)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="HH:mm"
                        dateFormat="HH:mm"
                        className="form-control"
                        placeholderText="Wybierz godzinę zakończenia"
                    />
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
    );
};

export default AddLecturePage;
