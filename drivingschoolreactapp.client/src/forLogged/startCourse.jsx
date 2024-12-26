import { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../cookieUtils';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const StartCourse = () => {
    // Stan formularza
    const [pesel, setPesel] = useState('');
    const [pkk, setPkk] = useState('');
    const [medicalCheck, setMedicalCheck] = useState(false);
    const [notes, setNotes] = useState('');
    const { purchaseDate, idService } = useParams();
    const [startDate, setStartDate] = useState('');

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
            const response = await axios.post('http://127.0.0.1:5254/api/TraineeCourse/', traineeCourseData, {
                headers: {
                    'Content-Type': 'application/json' // Make sure content type is set to JSON
                }
            });

            if (response.status === 200) {
                alert('Kurs rozpoczęty pomyślnie!');
                setPesel('');
                setPkk('');
                setMedicalCheck(false);
                setNotes('');
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
        <div className="start-course">
            <h2>Rozpocznij Kurs</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="pesel">PESEL:</label>
                    <input
                        type="text"
                        id="pesel"
                        value={pesel}
                        onChange={handlePeselChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="pkk">PKK:</label>
                    <input
                        type="text"
                        id="pkk"
                        value={pkk}
                        onChange={handlePkkChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="medicalCheck">Badania lekarskie:</label>
                    <input
                        type="checkbox"
                        id="medicalCheck"
                        checked={medicalCheck}
                        onChange={handleMedicalCheckChange}
                    />
                </div>
                <div>
                    <label htmlFor="notes">Uwagi:</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={handleNotesChange}
                    />
                </div>
                <button type="submit">Rozpocznij Kurs</button>
            </form>
        </div>
    );
};

export default StartCourse;
