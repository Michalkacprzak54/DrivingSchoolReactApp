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
        <div className ="div-form">
            <div className="container my-5"> 
                <div className="d-flex justify-content-center align-items-center">
                    <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Rejestracja</h2>
                            {error && <p className="alert alert-danger">{error}</p>}
                            <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label">Imię</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="form-control"
                                        placeholder="Imię"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Nazwisko</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="form-control"
                                        placeholder="Nazwisko"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="birthDay" className="form-label">Data urodzenia</label>
                                    <input
                                        type="date"
                                        id="birthDay"
                                        className="form-control"
                                        value={birthDay}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">Numer telefonu</label>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        className="form-control"
                                        placeholder="Numer telefonu"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="E-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Hasło</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        placeholder="Hasło"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="zipCode" className="form-label">Kod pocztowy</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        className="form-control"
                                        placeholder="Kod pocztowy"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">Miasto</label>
                                    <input
                                        type="text"
                                        id="city"
                                        className="form-control"
                                        placeholder="Miasto"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="street" className="form-label">Ulica</label>
                                    <input
                                        type="text"
                                        id="street"
                                        className="form-control"
                                        placeholder="Ulica"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="houseNumber" className="form-label">Numer domu</label>
                                    <input
                                        type="text"
                                        id="houseNumber"
                                        className="form-control"
                                        placeholder="Numer domu"
                                        value={houseNumber}
                                        onChange={(e) => setHouseNumber(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="flatNumber" className="form-label">Numer mieszkania</label>
                                    <input
                                        type="text"
                                        id="flatNumber"
                                        className="form-control"
                                        placeholder="Numer mieszkania"
                                        value={flatNumber}
                                        onChange={(e) => setFlatNumber(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Zarejestruj się</button>
                            </form>
                        </div>
                    </div>
                </div>
                </div>
       </div>
    );
}

export default RegisterForm;
