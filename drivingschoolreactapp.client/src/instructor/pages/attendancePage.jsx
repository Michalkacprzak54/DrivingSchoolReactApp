import { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from "../../utils/cookieUtils";
import CenteredSpinner from "../../components/centeredSpinner";
import { useParams } from "react-router-dom";

function AttendancePage() {
    const { idTheorySchedule } = useParams();
    const [trainees, setTrainees] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const instructorId = getCookie("instructorId");

    useEffect(() => {
        setLoading(true);
        setError(null);
        createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + '/uncompletedTrainees')
            .fetchAll()
            .then(response => {
                setTrainees(response.data);
                const initialAttendance = response.data.reduce((acc, trainee) => {
                    acc[trainee.IdTraineeCourse] = false;
                    return acc;
                }, {});
                setAttendance(initialAttendance);
            })
            .catch(error => {
                console.error("Błąd pobierania kursantów:", error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAttendanceChange = (id) => {
        setAttendance(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const submitAttendance = async () => {
        const presenceData = Object.keys(attendance)
            .filter(id => attendance[id])
            .map(id => ({
                idCourseDetails: trainees.find(t => t.idTraineeCourse == id).courseDetails.idCourseDetails,
                idTheorySchedule: Number(idTheorySchedule),
                presanceDate: new Date().toISOString().split('T')[0]
            }));

        if (presenceData.length === 0) {
            alert("Nie zaznaczono żadnych obecności.");
            return;
        }

        try {
            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + '/markPresence')
                .create(presenceData);

            if (response.status === 200 || response.status === 201 ) {
                alert("Obecności zapisane!");
                window.location.reload();
            } else {
                alert("Błąd podczas zapisywania obecności.");
            }
        } catch (error) {
            console.error("Błąd zapisywania obecności:", error);
            alert("Nie udało się zapisać obecności.");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Lista Obecności</h2>
            {loading && <CenteredSpinner />}
            {error && <p className="error text-center">{error}</p>}

            <table className="table table-bordered text-center">
                <thead className="bg-light">
                    <tr>
                        <th>#</th>
                        <th>Imię i nazwisko</th>
                        <th>Godziny teorii</th>
                        <th>Wymagane godziny</th>
                        <th>Obecność</th>
                    </tr>
                </thead>
                <tbody>
                    {trainees.map((trainee, index) => (
                        <tr key={trainee.idTraineeCourse}>
                            <td>{index + 1}</td>
                            <td>{trainee.client.clientFirstName} {trainee.client.clientLastName}</td>
                            <td>{trainee.courseDetails.theoryHoursCount}</td>
                            <td>{trainee.varinatService.numberTheoryHours}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={attendance[trainee.idTraineeCourse] || false}
                                    onChange={() => handleAttendanceChange(trainee.idTraineeCourse)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={submitAttendance}>Zapisz obecność</button>
            </div>
        </div>
    );
}

export default AttendancePage;