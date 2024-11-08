import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";

function TheoryPage() {
    const [tSchedules, setTSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTheorySchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchAll();
            setTSchedules(response.data);
        } catch (error) {
            console.error("B³¹d podczas pobierania harmonogramu:", error);
            setError("B³¹d pobierania danych. Spróbuj ponownie póŸniej.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTheorySchedules();
    }, []);


    return (
        <div>
            <h2>Harmonogram</h2>
            {loading && <p>£adowanie danych...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {Array.isArray(tSchedules) && tSchedules.length > 0 ? (
                    tSchedules.map(tSchedule => (
                        <li key={tSchedule.idTheorySchedule}>
                            <strong>:</strong> {tSchedule.groupName}<br />
                            <strong>:</strong> {tSchedule.date}<br />
                            <strong>:</strong> {tSchedule.dayName}<br />
                            <strong>:</strong> {tSchedule.startHour}<br />
                            <strong>:</strong> {tSchedule.endHour}<br />
                        </li>
                    ))
                ) : (
                    <p>Nie znaleziono harmonogramów.</p>
                )}
            </ul>
        </div>
    );

}

export default TheoryPage;