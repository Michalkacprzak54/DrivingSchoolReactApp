import React, { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../cookieUtils';

const PracticeSchedule = () => {
    const [practices, setPractices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funkcja do pobierania danych z API
    const fetchPractices = async () => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICE).fetchAll();
            setPractices(response.data);
        } catch (error) {
            setError('Błąd podczas ładowania danych.' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPractices();
    }, []);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Harmonogram Praktyk</h2>

            {loading && <p className="text-center">Ładowanie danych...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {practices.length > 0 ? (
                <div className="row">
                    {practices.map((practice) => (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={practice.idPratice}>
                            <div className="card shadow-lg">
                                <div className="card-body">
                                    <h5 className="card-title">Praktyka ID: {practice.idPratice}</h5>
                                    <p><strong>Data rezerwacji:</strong> {new Date(practice.reservationDate).toLocaleDateString()}</p>
                                    <p><strong>Data praktyki:</strong> {new Date(practice.praticeDate).toLocaleDateString()}</p>
                                    <p><strong>Godzina rozpoczęcia:</strong> {practice.startHour}</p>
                                    <p><strong>Godzina zakończenia:</strong> {practice.endHour}</p>
                                    <p><strong>Status:</strong> {practice.idStatus === 0 ? 'Nieaktywny' : 'Aktywny'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Brak danych do wyświetlenia.</p>
            )}
        </div>
    );
};

export default PracticeSchedule;
