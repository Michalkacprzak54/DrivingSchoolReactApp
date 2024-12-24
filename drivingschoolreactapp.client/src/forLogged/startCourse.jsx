import  { useState } from 'react';

const StartCourse = () => {
    // Stan formularza
    const [pesel, setPesel] = useState('');
    const [pkk, setPkk] = useState('');
    const [medicalCheck, setMedicalCheck] = useState(false);
    const [notes, setNotes] = useState('');

    // Funkcja do obs³ugi zmiany wartoœci w formularzu
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

    // Funkcja do wysy³ania formularza
    const handleSubmit = async (e) => {
        e.preventDefault();

        const traineeCourseData = {
            PESEL: pesel,
            PKK: pkk,
            MedicalCheck: medicalCheck,
            Notes: notes
        };

        try {
            const response = await fetch('https://your-api-endpoint/startCourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeCourseData),
            });

            if (response.ok) {
                alert('Kurs rozpoczêty pomyœlnie!');
                // Mo¿esz dodaæ inne akcje po pomyœlnym wys³aniu formularza, np. resetowanie formularza
                setPesel('');
                setPkk('');
                setMedicalCheck(false);
                setNotes('');
            } else {
                alert('Wyst¹pi³ b³¹d podczas rozpoczynania kursu.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Wyst¹pi³ b³¹d. Spróbuj ponownie.');
        }
    };

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
