import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/index';
import CenteredSpinner from "../../components/centeredSpinner";
import regexPatterns from '../../utils/regexPatterns';

function EditInstructorForm() {
    const { IdEmployee } = useParams(); 
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [teachesPractice, setTeachesPractice] = useState(false);
    const [teachesTheory, setTeachesTheory] = useState(false);
    const [pesel, setPesel] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchInstructorData = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(IdEmployee);
                if (response.status === 200) {
                    const data = response.data;
                    setFirstName(data.instructor.instructorFirstName);
                    setLastName(data.instructor.instructorLastName);
                    setBirthDay(data.instructorBirthDay);
                    setPhoneNumber(data.instructor.instructorPhhoneNumber);
                    setEmail(data.instructor.instructorEmail);
                    setPesel(data.instructorPesel);
                    setZipCode(data.zipCode.zipCodeNumber);
                    setCity(data.city.cityName);
                    setStreet(data.instructorStreet);
                    setHouseNumber(data.instructorHouseNumber);
                    setFlatNumber(data.instructorFlatNumber);
                    setTeachesPractice(data.instructor.instructorPratice);
                    setTeachesTheory(data.instructor.instructorTheory);
                } else {
                    setError("Nie udało się pobrać danych instruktora.");
                }
            } catch (error) {
                console.error("Błąd pobierania danych:", error);
                setError("Błąd połączenia z serwerem.");
            }
            finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [IdEmployee]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!regexPatterns.firstName.test(firstName)) {
            setError("Imię musi zaczynać się wielką literą i zawierać 2-50 znaków.");
            return;
        }

        if (!regexPatterns.lastName.test(lastName)) {
            setError("Nazwisko musi zaczynać się wielką literą i zawierać 2-50 znaków.");
            return;
        }

        if (!regexPatterns.email.test(email)) {
            setError("Podaj poprawny adres e-mail.");
            return;
        }

        if (!regexPatterns.phoneNumber.test(phoneNumber)) {
            setError("Podaj poprawny polski numer telefonu.");
            return;
        }

        if (!regexPatterns.pesel.test(pesel)) {
            setError("Numer PESEL musi zawierać dokładnie 11 cyfr.");
            return;
        }

        if (!regexPatterns.zipCode.test(zipCode)) {
            setError("Kod pocztowy powinien być w formacie XX-XXX.");
            return;
        }

        if (!regexPatterns.city.test(city)) {
            setError("Miasto musi zawierać tylko litery.");
            return;
        }

        if (!regexPatterns.street.test(street)) {
            setError("Ulica musi zawierać tylko litery i mieć długość 2-50 znaków.");
            return;
        }

        if (!regexPatterns.houseNumber.test(houseNumber)) {
            setError("Numer domu może zawierać cyfry i opcjonalnie literę.");
            return;
        }

        if (flatNumber && !regexPatterns.flatNumber.test(flatNumber)) {
            setError("Numer mieszkania może zawierać tylko cyfry.");
            return;
        }

        // Przygotowanie danych do wysłania
        const instructorData = {
            instructorFirstName: firstName,
            instructorLastName: lastName,
            instructorPhoneNumber: String(phoneNumber),
            instructorEmail: email,
            instructorTeachesPractice: teachesPractice,
            instructorTeachesTheory: teachesTheory,
            instructorDateOfBirth: birthDay,
            instructorPesel: String(pesel),
            instructorCity: city,
            instructorZipCode: zipCode,
            instructorStreet: street,
            instructorHouseNumber: String(houseNumber),
            instructorFlatNumber: flatNumber === "" ? null : flatNumber,
        };

        try {
            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA + "/editInstructor").update(IdEmployee, instructorData);

            if (response.status === 200) {
                alert("Instruktor został zaktualizowany pomyślnie!");
                navigate("/employeePage");
            } else {
                setError(response.data.message || "Nie udało się zaktualizować instruktora.");
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };

    if (loading) return <CenteredSpinner />
    return (
        <div className="div-form">
            <div className="container my-5">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Edytuj Instruktora</h2>
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

                                {/* Address Details */}
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

                                <button type="submit" className="btn btn-primary w-100">Zaktualizuj Instruktora</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInstructorForm;
