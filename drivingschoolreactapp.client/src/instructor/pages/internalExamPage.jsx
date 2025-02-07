import { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from "../../utils/cookieUtils";
import CenteredSpinner from "../../components/centeredSpinner";
import { useParams } from "react-router-dom";

function InternalExamPage() {
    const { idTheorySchedule } = useParams();
    const [trainees, setTrainees] = useState([]);
    const [examResults, setExamResults] = useState({});
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
                const initialResults = response.data.reduce((acc, trainee) => {
                    acc[trainee.idTraineeCourse] = false;
                    return acc;
                }, {});
                setExamResults(initialResults);
            })
            .catch(error => {
                console.error("Błąd pobierania kursantów:", error);
                setError("Błąd pobierania danych. Spróbuj ponownie później.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleExamResultChange = (id) => {
        setExamResults(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const submitExamResults = async () => {
        const courseDetailsIds = Object.keys(examResults)
            .filter(id => examResults[id])
            .map(id => trainees.find(t => t.idTraineeCourse == id).courseDetails.idCourseDetails);

        if (courseDetailsIds.length === 0) {
            alert("Nie zaznaczono żadnych zaliczonych egzaminów.");
            return;
        }

        try {
            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE + '/markInternalExam')
                .create({ courseDetailsIds });

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
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={submitExamResults}>Zapisz wyniki egzaminu</button>
            </div>
        </div>
    );
}

export default InternalExamPage;
