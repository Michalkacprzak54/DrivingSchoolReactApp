import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditClientForm() {
    const { id } = useParams(); // ID klienta przekazane w ścieżce
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        clientFirstName: '',
        clientLastName: '',
        clientBirthDay: '',
        clientPhoneNumber: '',
        clientEmail: '',
        clientPassword: '',
        zipCode: { zipCodeNumber: '' },
        city: { cityName: '' },
        clientHouseNumber: '',
        clientFlatNumber: '',
        clientStatus: false,
    });

    // Pobieranie danych klienta przy montowaniu komponentu
    useEffect(() => {
        async function fetchClientData() {
            try {
                const response = await fetch(`https://localhost:7056/api/Client/${id}`);
                if (response.ok) {
                    const clientData = await response.json();
                    setFormData(clientData);
                    console.log(clientData.idClient)
                } else {
                    console.error("Nie udało się pobrać danych klienta");
                }
            } catch (error) {
                console.error("Błąd podczas pobierania danych klienta:", error);
            }
        }
        fetchClientData();
    }, [id]);

    // Obsługa zmian w formularzu
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        // Sprawdzenie, czy pole dotyczy zipCode lub city
        if (name.startsWith("zipCode") || name.startsWith("city")) {
            const objectName = name.startsWith("zipCode") ? "zipCode" : "city";
            const propertyName = name.charAt(0).toLowerCase() + name.slice(1); // Pobieramy nazwę właściwości

            setFormData((prevState) => ({
                ...prevState,
                [objectName]: {
                    ...prevState[objectName],
                    [propertyName]: fieldValue,
                },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: fieldValue,
            }));
        }
    };

    // Obsługa wysłania formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7056/api/Client/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Dane klienta zostały zaktualizowane!');
                navigate("/clients"); // przekierowanie do listy klientów
            } else {
                alert('Wystąpił błąd podczas aktualizacji danych klienta.');
            }
        } catch (error) {
            console.error('Błąd:', error);
            console.log("Wysyłane dane:", formData);
            alert('Wystąpił błąd podczas aktualizacji danych klienta.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Imię:
                <input type="text" name="clientFirstName" value={formData.clientFirstName} onChange={handleChange} required />
            </label>
            <label>
                Nazwisko:
                <input type="text" name="clientLastName" value={formData.clientLastName} onChange={handleChange} required />
            </label>
            <label>
                Data urodzenia:
                <input type="date" name="clientBirthDay" value={formData.clientBirthDay} onChange={handleChange} required />
            </label>
            <label>
                Numer telefonu:
                <input type="text" name="clientPhoneNumber" value={formData.clientPhoneNumber} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} required />
            </label>
            <label>
                Hasło:
                <input type="password" name="clientPassword" value={formData.clientPassword} onChange={handleChange} required />
            </label>
            <label>
                Kod pocztowy:
                <input type="text" name="zipCodeNumber" value={formData.zipCode.zipCodeNumber} onChange={handleChange} required />
            </label>
            <label>
                Miasto:
                <input type="text" name="cityName" value={formData.city.cityName} onChange={handleChange} required />
            </label>
            <label>
                Numer domu:
                <input type="text" name="clientHouseNumber" value={formData.clientHouseNumber} onChange={handleChange} required />
            </label>
            <label>
                Numer lokalu:
                <input type="number" name="clientFlatNumber" value={formData.clientFlatNumber || ''} onChange={handleChange} />
            </label>
            <label>
                Status kursanta:
                <input type="checkbox" name="clientStatus" checked={formData.clientStatus} onChange={handleChange} />
            </label>
            
            <button type="submit">Zaktualizuj klienta</button>
        </form>
    );
}

export default EditClientForm;
