import React, { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate, useParams } from "react-router-dom";

const PracticeSchedule = () => {
    const [schedules, setSchedules] = useState([]); 
    const [reservations, setReservations] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchData = async () => {
        try {
            const scheduleResponse = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES).fetchAll();
            const reservationResponse = await createAPIEndpoint(ENDPOINTS.PRATICE).fetchAll(); 

            setSchedules(scheduleResponse.data);
            setReservations(reservationResponse.data);
        } catch (error) {
            setError('Błąd podczas ładowania danych.' + error);
        } finally {
            setLoading(false);
        }
    };

    // Łączenie harmonogramu z rezerwacjami
    const combineData = () => {
        return schedules.map((schedule) => {
            // Znajdź rezerwacje dla danego harmonogramu
            const scheduleReservations = reservations.filter(
                (reservation) => reservation.idPraticeSchedule === schedule.idPraticeSchedule
            );

            return {
                ...schedule, // Zawiera dane z harmonogramu
                reservations: scheduleReservations, // Dodaj rezerwacje
            };
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const combinedData = combineData();
    const occupiedSchedules = combinedData.filter(schedule => schedule.reservations.length > 0);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Harmonogram Praktyk</h2>

            {loading && <p className="text-center">Ładowanie danych...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {occupiedSchedules.length > 0 ? (
                <div className="row">
                    {occupiedSchedules.map((schedule) => (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={schedule.idPraticeSchedule}>
                            <div className="card shadow-lg">
                                <div className="card-body">
                                    <h5 className="card-title">{schedule.dayName} - {new Date(schedule.date).toLocaleDateString()}</h5>
                                    <p><strong>Godzina rozpoczęcia:</strong> {schedule.startDate}</p>
                                    <p><strong>Godzina zakończenia:</strong> {schedule.endDate}</p>
                                    <p><strong>Status:</strong> {schedule.is_Available ? 'Dostępna' : 'Niedostępna'}</p>

                                    <h6 className="mt-3">Rezerwacje:</h6>
                                    {schedule.reservations.length > 0 ? (
                                        <ul>
                                            {schedule.reservations.map((reservation) => (
                                                <li key={reservation.idPratice}>
                                                    <p><strong>Praktyka ID:</strong> {reservation.idPratice}</p>
                                                    <p><strong>Data rezerwacji:</strong> {new Date(reservation.reservationDate).toLocaleString()}</p>
                                                    <p><strong>Status:</strong> {reservation.idStatus === 1 ? 'Aktywny' : 'Nieaktywny'}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Brak rezerwacji.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Brak zajętych harmonogramów do wyświetlenia.</p>
            )}
        </div>
    );
};

export default PracticeSchedule;
