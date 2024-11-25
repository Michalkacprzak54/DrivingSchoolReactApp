import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';

function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 
    const nameRegex = /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{2,50}$/;

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };
    
    useEffect(() => {
        const token = getCookie('jwtToken');
        if (token) {
            /*alert('Jesteś już zalogowany. Rejestracja jest niedostępna.');*/
            navigate('/login');
        }
        
        const date = getDateSeventeenYearsAndNineMonthsAgo();
        const formattedDate = date.toISOString().split("T")[0];
        setBirthDay(formattedDate); 
    }, [navigate]);

    function getDateSeventeenYearsAndNineMonthsAgo() {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 17);
        today.setMonth(today.getMonth() - 9);
        return today;
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (firstName.length > 50) {
            setError("Imię może zawierać maksymalnie 50 znaków.");
            return;
        } else if (!nameRegex.test(firstName)) {
            setError("Imię musi zawierać minimum 2 litery.");
            return;
        }

        if (lastName.length > 50) {
            setError("Imię może zawierać maksymalnie 50 znaków.");
            return;
        } else if (!nameRegex.test(lastName)) {
            setError("Imię musi zawierać minimum 2 litery.");
            return;
        }

        const minBirthDate = getDateSeventeenYearsAndNineMonthsAgo();
        const birthDate = new Date(birthDay); // Wprowadzona data urodzenia

        if (birthDate > minBirthDate) {
            setError("Musisz mieć przynajmniej 17 lat i 9 miesięcy, aby się zarejestrować.");
            return;
        }

        // Przygotowanie danych rejestracji do wysłania na serwer
        const registerData = {
            firstName,
            lastName,
            birthDay,
            phoneNumber,
            email,
            password,
            zipCode,
            city,
            street,
            houseNumber,
            flatNumber
        };

        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT_REGISTER).register(registerData);
            
            if (response.status === 201) { // Sprawdź status odpowiedzi, np. 201 - Utworzono
                alert("Rejestracja zakończona sukcesem!");
                navigate('/login');
            } else {
                setError(response.data.message || "Nie udało się zarejestrować."); // Obsługa odpowiedzi serwera
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div>
            <h2>Rejestracja</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="text"
                    placeholder="Imię"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    />
                <input
                    type="text"
                    placeholder="Nazwisko"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    
                />
                <input
                    type="date"
                    placeholder="Data urodzenia"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    
                />
                <input
                    type="text"
                    placeholder="Numer telefonu"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                   
                />
                <input
                    type="text"
                    placeholder="Kod pocztowy"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    
                />
                <input
                    type="text"
                    placeholder="Miasto"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    
                />
                <input
                    type="text"
                    placeholder="Ulica"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    
                />
                <input
                    type="text"
                    placeholder="Numer domu"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Numer mieszkania"
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                />
                <button type="submit">Zarejestruj się</button>
            </form>
        </div>
    );
}

export default RegisterForm;
