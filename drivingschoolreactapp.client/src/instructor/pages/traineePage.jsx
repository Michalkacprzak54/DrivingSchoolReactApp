import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getZonedCurrentDate } from '../../utils/dateUtils';

function TraineePage() {
    const { idCourseDetails, instructorId } = useParams();
    const [traineeData, setTraineeData] = useState(null);
    const [availableSchedules, setAvailableSchedules] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScheduleForm, setShowScheduleForm] = useState(false); 
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTraineeData = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + "/byDetailsId").fetchById(idCourseDetails);
                if (response.data && response.data.length > 0) {
                    setTraineeData(response.data[0]);
                } else {
                    setError("Nie znaleziono danych kursanta.");
                }
            } catch (err) {
                console.error("Błąd pobierania danych kursanta:", err);
                setError("Wystąpił błąd podczas pobierania danych.");
            } finally {
                setLoading(false);
            }
        };

        const fetchAvailableSchedules = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES + "/id").fetchById(instructorId);
                if (response.data) {
                    const today = new Date();
                    const filteredSchedules = response.data.filter(schedule => {
                        const scheduleDate = new Date(schedule.date);
                        return scheduleDate > today && schedule.is_Available; 
                    });
                    setAvailableSchedules(filteredSchedules);
                } else {
                    setError("Brak dostępnych terminów.");
                }
            } catch (err) {
                console.error("Błąd pobierania terminów:", err);
                setError("Nie udało się pobrać dostępnych terminów.");
            }
        };

        fetchTraineeData();
        fetchAvailableSchedules();
    }, [idCourseDetails, instructorId]);

    const handleScheduleClick = () => {
        setShowScheduleForm(true);
    };

    const formatTime = (time) => {
        if (!time) return "Brak danych";
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    const handleRegisterForPractice = async (praticeScheduleId, IdCourseDetails) => {
        if (!praticeScheduleId) {
            alert("Wybierz termin przed zapisaniem.");
            return;
        }

        const formattedDate = getZonedCurrentDate();

        try {
            const response = await createAPIEndpoint(ENDPOINTS.PRATICE).create({
                idPraticeSchedule: praticeScheduleId,
                idCourseDetails: IdCourseDetails,
                reservationDate: formattedDate,
                idStatus: 1
            });

            if ([200, 201, 204].includes(response.status)) {
                alert("Zapisano pomyślnie!");
                window.location.reload();
            } else {
                console.warn("Nieoczekiwany status odpowiedzi:", response.status);
                alert("Błąd podczas zapisywania na jazdy. Spróbuj ponownie.");
            }
        } catch (error) {
            console.error("Błąd podczas zapisywania na jazdy:", error);
            alert("Błąd podczas zapisywania. Spróbuj ponownie.");
        }
    };


    return (
        <div className="container py-5">

            <div className="d-flex justify-content-start mb-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/instructorSchedule`)}
                >
                    Powrót do harmonogramu
                </button>
            </div>

            <h2 className="text-center mb-4">Dane Kursanta</h2>

            {loading && <p className="text-center">Ładowanie danych...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {traineeData && (
                <div className="card mx-auto p-4" style={{ maxWidth: "600px" }}>
                    <h4>Kursant</h4>
                    <p><strong>Imię i nazwisko:</strong> {traineeData.client.clientFirstName} {traineeData.client.clientLastName}</p>
                    <p><strong>PKK:</strong> {traineeData.pkk}</p>
                    <p><strong>Badania lekarskie:</strong> {traineeData.medicalCheck ? "Tak" : "Nie"}</p>

                    <hr />
                    <h4>Informacje o kursie</h4>
                    <p><strong>Kurs:</strong> {traineeData.service.serviceName}</p>
                    <p><strong>Kategoria:</strong> {traineeData.service.serviceCategory}</p>
                    <p><strong>Wariant:</strong> {traineeData.varinatService.variant}</p>
                    <p><strong>Liczba godzin teorii:</strong> {traineeData.varinatService.numberTheoryHours}</p>
                    <p><strong>Liczba godzin praktyki:</strong> {traineeData.varinatService.numberPraticeHours}</p>

                    <hr />
                    <h4>Postęp kursu</h4>
                    <p><strong>Odbyte godziny teorii:</strong> {traineeData.courseDetails.theoryHoursCount} / {traineeData.varinatService.numberTheoryHours}</p>
                    <p><strong>Odbyte godziny praktyki:</strong> {traineeData.courseDetails.praticeHoursCount} / {traineeData.varinatService.numberPraticeHours}</p>
                    <p><strong>Egzamin wewnętrzny:</strong> {traineeData.courseDetails.internalExam ? "Zaliczone" : "Nie zaliczone"}</p>
                    <p><strong>Data rozpoczęcia kursu:</strong> {traineeData.startDate}</p>
                    <button
                        className="btn btn-success w-100"
                        onClick={handleScheduleClick}
                    >
                        Zapisz na jazdy
                    </button>

                    {showScheduleForm && (
                        <div className="mt-4">
                            <h4>Wybierz termin jazdy</h4>
                            {availableSchedules.length > 0 ? (
                                <select
                                    className="form-control mb-3"
                                    value={selectedScheduleId}
                                    onChange={(e) => setSelectedScheduleId(e.target.value)}
                                >
                                    <option value="">Wybierz termin</option>
                                    {availableSchedules.map((schedule) => (
                                        <option key={schedule.idPraticeSchedule} value={schedule.idPraticeSchedule}>
                                            {new Date(schedule.date).toLocaleDateString()} - {formatTime(schedule.startDate)} do {formatTime(schedule.endDate)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>Brak dostępnych terminów.</p>
                            )}

                            <button
                                className="btn btn-primary w-100"
                                onClick={() => handleRegisterForPractice(selectedScheduleId, idCourseDetails)}
                            >
                                Potwierdź zapis
                            </button>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TraineePage;
