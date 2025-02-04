import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';
import validator from 'validator';

function AddInstructorForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [teachesPractice, setTeachesPractice] = useState(false);
    const [teachesTheory, setTeachesTheory] = useState(false);
    const [pesel, setPesel] = useState("");  
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const date = getDateTwentyYearsAgo();
        const formattedDate = date.toISOString().split("T")[0];
        setBirthDay(formattedDate);
    }, [navigate]);

    function getDateTwentyYearsAgo() {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 20);
        return today;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate first name
        if (!validator.isLength(firstName, { min: 2, max: 50 })) {
            setError("Imię musi zawierać od 2 do 50 znaków.");
            return;
        }

        // Validate last name
        if (!validator.isLength(lastName, { min: 2, max: 50 })) {
            setError("Nazwisko musi zawierać od 2 do 50 znaków.");
            return;
        }

        // Validate email
        if (!validator.isEmail(email)) {
            setError("Podaj poprawny adres e-mail.");
            return;
        }

        // Validate phone number (Polish format)
        if (!validator.isMobilePhone(phoneNumber, 'pl-PL')) {
            setError("Podaj poprawny numer telefonu (9 cyfr).");
            return;
        }

        // Validate PESEL (11 digits)
        if (!validator.isLength(pesel, { min: 11, max: 11 }) || !validator.isNumeric(pesel)) {
            setError("Numer PESEL musi zawierać dokładnie 11 cyfr.");
            return;
        }

        // Validate passwords
        if (password !== confirmPassword) {
            setError("Hasła nie są zgodne.");
            return;
        }

        // Prepare the data for submission
        const instructorData = {
            instructorFirstName: firstName,
            instructorLastName: lastName,
            instructorPhoneNumber: phoneNumber,
            instructorEmail: email,
            instructorTeachesPractice: teachesPractice,
            instructorTeachesTheory: teachesTheory,
            instructorDateOfBirth: birthDay,
            instructorPassword: password,
            instructorPesel: pesel,
            instructorCity: city,
            instructorZipCode: zipCode,
            instructorStreet: street,
            instructorHouseNumber: houseNumber,
            instructorFlatNumber: flatNumber || 0,
        };

        try {
            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA + '/addInstructor').create(instructorData);

            if (response.status === 200) {
                alert("Instruktor został dodany pomyślnie!");
                navigate('/employeePage');
            } else {
                setError(response.data.message || "Nie udało się dodać instruktora.");
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="div-form">
            <div className="container my-5">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Dodaj Instruktora</h2>
                            {error && <p className="alert alert-danger">{error}</p>}
                            <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
                                {/* First Name */}
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

                                {/* Last Name */}
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

                                {/* Birth Date */}
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

                                {/* Phone Number */}
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

                                {/* Email */}
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

                                {/* Password */}
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

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Potwierdź hasło</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-control"
                                        placeholder="Potwierdź hasło"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>

                                {/* Zip Code */}
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

                                {/* City */}
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

                                {/* Street */}
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

                                {/* House Number */}
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

                                {/* Flat Number */}
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

                                {/* PESEL */}
                                <div className="mb-3">
                                    <label htmlFor="pesel" className="form-label">PESEL</label>
                                    <input
                                        type="text"
                                        id="pesel"
                                        className="form-control"
                                        placeholder="Numer PESEL"
                                        value={pesel}
                                        onChange={(e) => setPesel(e.target.value)}
                                        maxLength="11"
                                    />
                                </div>

                                {/* Teaches Practice */}
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        id="teachesPractice"
                                        className="form-check-input"
                                        checked={teachesPractice}
                                        onChange={(e) => setTeachesPractice(e.target.checked)}
                                    />
                                    <label htmlFor="teachesPractice" className="form-check-label">Prowadzi praktykę</label>
                                </div>

                                {/* Teaches Theory */}
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        id="teachesTheory"
                                        className="form-check-input"
                                        checked={teachesTheory}
                                        onChange={(e) => setTeachesTheory(e.target.checked)}
                                    />
                                    <label htmlFor="teachesTheory" className="form-check-label">Prowadzi teorię</label>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Dodaj Instruktora</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInstructorForm;
