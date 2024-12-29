import { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../cookieUtils';
import { useNavigate, useParams } from "react-router-dom";
//import axios from 'axios';

const StartCourse = () => {
    // Stan formularza
    const [pesel, setPesel] = useState('');
    const [pkk, setPkk] = useState('');
    const [medicalCheck, setMedicalCheck] = useState(false);
    const [notes, setNotes] = useState('');
    const { purchaseDate, idService } = useParams();
    const [startDate, setStartDate] = useState('');
    const navigate = useNavigate();

    // Funkcja do obsługi zmiany wartości w formularzu
    const handlePeselChange = (e) => {
        setPesel(e.target.value);
    };

    const handlePkkChange = (e) => {
        setPkk(e.target.value);
    };

    const handleMedicalCheckChange = (e) => {
        setMedicalCheck(e.target.checked);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    // Funkcja do wysyłania formularza
    const handleSubmit = async (e) => {
        e.preventDefault();

        const traineeCourseData = {
                client: {
                    idClient: getCookie('userId')
                },
                service: {
                    idService: idService
                },
                startDate: startDate,
                endDate: null, 
                status: {
                    idStatus: 1
                },
                purchaseDate: purchaseDate,
                pesel: pesel,
                pkk: pkk,
                medicalCheck: medicalCheck,
                notes: notes || null
            
        };
        console.log('Sending data:', traineeCourseData);


        try {
            
            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE).create(traineeCourseData);

            if (response.status === 200) {
                alert('Kurs rozpoczęty pomyślnie!');
                setPesel('');
                setPkk('');
                setMedicalCheck(false);
                setNotes('');
                navigate('/purchaseHistory');
            } else {
                // Błąd w odpowiedzi
                console.error('Error details:', response.data);
                alert(`Wystąpił błąd: ${response.data.message || 'Spróbuj ponownie.'}`);
            }
        } catch (error) {
            if (error.response) {
                // Błąd odpowiedzi serwera
                console.error('Server error response:', error.response.data);
                alert(`Błąd serwera: ${error.response.data.message || 'Spróbuj ponownie.'}`);
            } else if (error.request) {
                // Brak odpowiedzi serwera
                console.error('No response received:', error.request);
                alert('Brak odpowiedzi serwera. Sprawdź swoje połączenie.');
            } else {
                // Inny błąd
                console.error('Error:', error.message);
                alert(`Wystąpił błąd: ${error.message}`);
            }
        }


    };

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];  // Formatujemy datę na 'YYYY-MM-DD'
        setStartDate(formattedDate);
    }, []);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Rozpocznij Kurs</h2>
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
                <button type="submit" className="btn btn-primary">Rozpocznij Kurs</button>
            </form>
        </div>
    );
};

export default StartCourse;
