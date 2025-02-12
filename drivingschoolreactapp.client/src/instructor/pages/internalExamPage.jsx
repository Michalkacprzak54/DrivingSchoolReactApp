import { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import CenteredSpinner from "../../components/centeredSpinner";

function InternalExamPage() {
    const [trainees, setTrainees] = useState([]);
    const [examResults, setExamResults] = useState({});
    const [theoryHours, setTheoryHours] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + "/uncompletedTrainees")
            .fetchAll()
            .then((response) => {
                setTrainees(response.data);

                // Inicjalizacja stanu dla egzaminów i godzin teorii
                const initialResults = response.data.reduce((acc, trainee) => {
                    acc[trainee.idTraineeCourse] = false;
                    return acc;
                }, {});

                const initialTheoryHours = response.data.reduce((acc, trainee) => {
                    acc[trainee.idTraineeCourse] = trainee.courseDetails.theoryHoursCount || 0;
                    return acc;
                }, {});

                setExamResults(initialResults);
                setTheoryHours(initialTheoryHours);
            })
            .catch((error) => {
                console.error("Błąd pobierania kursantów:", error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleExamResultChange = (id) => {
        setExamResults((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const handleTheoryHoursChange = (id, value) => {
        setTheoryHours((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const submitExamResults = async () => {
        const courseDetails = Object.keys(examResults)
            .filter((id) => examResults[id])
            .map((id) => ({
                idSzczegoly: trainees.find((t) => t.idTraineeCourse == id).courseDetails.idCourseDetails,
                godzinyTeoria: parseInt(theoryHours[id], 10) || 0,
            }));

        if (courseDetails.length === 0) {
            alert("Nie zaznaczono żadnych zaliczonych egzaminów.");
            return;
        }

        try {
            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + "/markInternalExam")
                .create({ courseDetails });

            if (response.status === 200 || response.status === 201) {
                alert("Egzaminy wewnętrzne zostały zaliczone!");
                window.location.reload();
            } else {
                alert("Błąd podczas zapisywania wyników egzaminu.");
            }
        } catch (error) {
            console.error("Błąd zapisywania egzaminu:", error);
            alert("Nie udało się zapisać wyników egzaminu.");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Zaliczanie Egzaminu Wewnętrznego</h2>
            {loading && <CenteredSpinner />}
            {error && <p className="error text-center">{error}</p>}

            <table className="table table-bordered text-center">
                <thead className="bg-light">
                    <tr>
                        <th>#</th>
                        <th>Imię i nazwisko</th>
                        <th>Egzamin Wewnętrzny</th>
                        <th>Liczba godzin teorii</th>
                    </tr>
                </thead>
                <tbody>
                    {trainees.map((trainee, index) => (
                        <tr key={trainee.idTraineeCourse}>
                            <td>{index + 1}</td>
                            <td>{trainee.client.clientFirstName} {trainee.client.clientLastName}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={examResults[trainee.idTraineeCourse] || false}
                                    onChange={() => handleExamResultChange(trainee.idTraineeCourse)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control text-center"
                                    value={theoryHours[trainee.idTraineeCourse] || 0}
                                    onChange={(e) => handleTheoryHoursChange(trainee.idTraineeCourse, e.target.value)}
                                    min="0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={submitExamResults}>
                    Zapisz wyniki egzaminu
                </button>
            </div>
        </div>
    );
}

export default InternalExamPage;
