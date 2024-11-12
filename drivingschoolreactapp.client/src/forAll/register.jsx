import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            houseNumber,
            flatNumber
        };

        try {
            const response = await fetch("https://localhost:7056/api/Client/Register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            });
            const responseText = await response.text();
            console.log("Odpowiedź z serwera:", responseText);
            if (response.ok) {
                try {
                    // Spróbuj parsować odpowiedź jako JSON
                    const data = JSON.parse(responseText); // Parsowanie odpowiedzi jako JSON
                    alert("Rejestracja zakończona sukcesem!");
                    navigate('/login');
                } catch (jsonError) {
                    // Jeśli nie uda się sparsować jako JSON, wyświetl odpowiedź tekstową
                    console.error("Błąd parsowania JSON:", jsonError);
                    setError("Błąd odpowiedzi z serwera. Odpowiedź: " + responseText);
                }
            } else {
                // Jeśli odpowiedź nie jest OK, wyświetl błąd
                setError(responseText || "Nie udało się zarejestrować.");
            }
        } catch (error) {
            setError("Błąd połączenia z serwerem.");
            console.error("Błąd połączenia z serwerem:", error); // Logowanie błędu
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
