import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { getCookie } from '../cookieUtils';

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
    const [setIsLoggedIn] = useState(false);
    const [setUserId] = useState(null);
    const navigate = useNavigate();
    const nameRegex = /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{2,50}$/;

    useEffect(() => {
        const token = getCookie('jwtToken');
        const storedUserId = getCookie('userId');

        if (token && storedUserId) {
            setIsLoggedIn(true)
            setUserId(storedUserId)
            navigate("/");
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
        const birthDate = new Date(birthDay);

        if (birthDate > minBirthDate) {
            setError("Musisz mieć przynajmniej 17 lat i 9 miesięcy, aby się zarejestrować.");
            return;
        }

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
            flatNumber: flatNumber.trim() === "" ? null : flatNumber 
        };

        try {
            const response = await createAPIEndpoint(ENDPOINTS.CLIENT_REGISTER).register(registerData);

            if (response.status === 201) {
                alert("Rejestracja zakończona sukcesem!");
                navigate('/login');
            } else {
                setError(response.data.message || "Nie udało się zarejestrować.");
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Rejestracja</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="input-group">
                    <label className="input-label" htmlFor="firstName">Imię</label>
                    <input
                        className="input-field"
                        type="text"
                        id="firstName"
                        placeholder="Imię"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="lastName">Nazwisko</label>
                    <input
                        className="input-field"
                        type="text"
                        id="lastName"
                        placeholder="Nazwisko"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="birthDay">Data urodzenia</label>
                    <input
                        className="input-field"
                        type="date"
                        id="birthDay"
                        placeholder="Data urodzenia"
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="phoneNumber">Numer telefonu</label>
                    <input
                        className="input-field"
                        type="text"
                        id="phoneNumber"
                        placeholder="Numer telefonu"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="email">E-mail</label>
                    <input
                        className="input-field"
                        type="email"
                        id="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="password">Hasło</label>
                    <input
                        className="input-field"
                        type="password"
                        id="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="zipCode">Kod pocztowy</label>
                    <input
                        className="input-field"
                        type="text"
                        id="zipCode"
                        placeholder="Kod pocztowy"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="city">Miasto</label>
                    <input
                        className="input-field"
                        type="text"
                        id="city"
                        placeholder="Miasto"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="street">Ulica</label>
                    <input
                        className="input-field"
                        type="text"
                        id="street"
                        placeholder="Ulica"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="houseNumber">Numer domu</label>
                    <input
                        className="input-field"
                        type="text"
                        id="houseNumber"
                        placeholder="Numer domu"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="flatNumber">Numer mieszkania</label>
                    <input
                        className="input-field"
                        type="text"
                        id="flatNumber"
                        placeholder="Numer mieszkania"
                        value={flatNumber}
                        onChange={(e) => setFlatNumber(e.target.value)}
                    />
                </div>
                <button className="submit-button" type="submit">Zarejestruj się</button>
            </form>
        </div>
    );
}

export default RegisterForm;
