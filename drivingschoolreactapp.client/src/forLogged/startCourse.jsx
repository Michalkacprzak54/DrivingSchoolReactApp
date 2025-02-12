import { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../utils/cookieUtils';
import { useNavigate, useParams } from "react-router-dom";
import regexPatterns from '../utils/regexPatterns';

const StartCourse = () => {
    // Stan formularza
    const [pesel, setPesel] = useState('');
    const [pkk, setPkk] = useState('');
    const [medicalCheck, setMedicalCheck] = useState(false);
    const [parentalConsent, setParentalConsent] = useState(false);
    const [notes, setNotes] = useState('');
    const { purchaseDate, idVariantService } = useParams();
    const [startDate, setStartDate] = useState('');
    const navigate = useNavigate();
    const [clientData, setClientData] = useState(null);
    const clientId = getCookie('userId');
    const [isAdult, setIsAdult] = useState(false);
    const [error, setError] = useState(null);

    const fetchClientData = async () => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT).fetchById(clientId);
            const client = response.data;

            setClientData(client); // Zapisz dane klienta w stanie

            // Oblicz, czy klient ma więcej niż 18 lat
            if (client.clientBirthDay) {
                const birthDate = new Date(client.clientBirthDay);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                console.log('Age:', age);
                setIsAdult(age >= 18);
            }
        } catch (error) {
            console.error("Błąd pobierania danych klienta:", error);
        }
    };

    const handlePeselChange = (e) => {
        setPesel(e.target.value);
    };

    const handlePkkChange = (e) => {
        setPkk(e.target.value);
    };

    const handleMedicalCheckChange = (e) => {
        setMedicalCheck(e.target.checked);
    };

    const handleParentalConsentChange = (e) => {
        setParentalConsent(e.target.checked);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!regexPatterns.pesel.test(pesel)) {
            setError("PESEL musi składać się z dokładnie 11 cyfr.");
            return;
        }

        if (!regexPatterns.pkk.test(pkk)) {
            setError("PKK musi składać się z dokładnie 26 znaków.");
            return;
        }

        const traineeCourseData = {
                client: {
                    idClient: getCookie('userId')
                },
                varinatService: {
                    idVariantService: idVariantService
                },
                startDate: startDate,
                endDate: null, 
                status: {
                    idStatus: 2
                },
                purchaseDate: purchaseDate,
                pesel: pesel,
                pkk: pkk,
                medicalCheck: medicalCheck,
                parentalConsent: !isAdult ? parentalConsent : null,
                notes: notes || null
            
        };
        /*console.log('Sending data:', traineeCourseData);*/


        try {
            
            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE).create(traineeCourseData);

            if (response.status === 200) {
                alert('Kurs rozpoczęty pomyślnie!');
                setPesel('');
                setPkk('');
                setMedicalCheck(false);
                setParentalConsent(false);
                setNotes('');
                navigate('/purchaseHistory');
            } else {
                alert(`Wystąpił błąd: ${response.data.message || 'Spróbuj ponownie.'}`);
            }
        } catch (error) {
            if (error.response) {

                alert(`Błąd serwera: ${error.response.data.message || 'Spróbuj ponownie.'}`);
            } else if (error.request) {

                alert('Brak odpowiedzi serwera. Sprawdź swoje połączenie.');
            } else {

                alert(`Wystąpił błąd: ${error.message}`);
            }
        }


    };

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];  // Formatujemy datę na 'YYYY-MM-DD'
        setStartDate(formattedDate);
        fetchClientData();
    }, []);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Rozpocznij Kurs</h2>

            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="pesel" className="form-label">PESEL:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="pesel"
                        value={pesel}
                        onChange={handlePeselChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="pkk" className="form-label">PKK:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="pkk"
                        value={pkk}
                        onChange={handlePkkChange}
                        required
                    />
                </div>
                {!isAdult && (
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="parentalConsent"
                            checked={parentalConsent}
                            onChange={handleParentalConsentChange}
                            required
                        />
                        <label htmlFor="parentalConsent" className="form-check-label">
                            Zgoda rodzica
                        </label>
                    </div>
                )}
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="medicalCheck"
                        checked={medicalCheck}
                        onChange={handleMedicalCheckChange}
                    />
                    <label htmlFor="medicalCheck" className="form-check-label">Badania lekarskie</label>
                </div>
                <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Uwagi:</label>
                    <textarea
                        id="notes"
                        className="form-control"
                        value={notes}
                        onChange={handleNotesChange}
                    />
                </div>
                <div className="alert alert-info" role="alert">
                    Wszystkie wymagane dokumenty prosimy dostarczyć na pierwszy wykład
                    lub indywidualnie do szkoły jazdy. Dziękujemy!
                </div>
                <button type="submit" className="btn btn-primary">Rozpocznij Kurs</button>
            </form>
        </div>
    );
};

export default StartCourse;
