import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../api/index';
import { getCookie } from '../utils/cookieUtils';
import regexPatterns from '../utils/regexPatterns';

function RegisterForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDay: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        zipCode: "",
        city: "",
        street: "",
        houseNumber: "",
        flatNumber: ""
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = getCookie('jwtToken');
        const storedUserId = getCookie('userId');

        if (token && storedUserId) {
            navigate("/");
        }

        const date = getDateSeventeenYearsAndNineMonthsAgo();
        const formattedDate = date.toISOString().split("T")[0];
        setFormData(prevState => ({ ...prevState, birthDay: formattedDate }));
    }, [navigate]);

    function getDateSeventeenYearsAndNineMonthsAgo() {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 13);
        today.setMonth(today.getMonth() - 9);
        return today;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const placeholders = {
        firstName: "Imię",
        lastName: "Nazwisko",
        birthDay: "Data urodzenia",
        phoneNumber: "Numer telefonu",
        email: "Adres e-mail",
        password: "Hasło",
        confirmPassword: "Potwierdź hasło",
        zipCode: "Kod pocztowy",
        city: "Miasto",
        street: "Ulica",
        houseNumber: "Numer domu",
        flatNumber: "Numer mieszkania (opcjonalne)"
    };

    const validateInput = () => {
        let tempErrors = {};

        for (const field in formData) {
            let trimmedValue = formData[field].trim();

            if (regexPatterns[field] && !regexPatterns[field].test(trimmedValue)) {
                tempErrors[field] = {
                    firstName: "Imię może zawierać tylko litery i musi zaczynać się wielką literą.",
                    lastName: "Nazwisko może zawierać tylko litery i musi zaczynać się wielką literą.",
                    phoneNumber: "Podaj poprawny numer telefonu w formacie 123 456 789.",
                    email: "Podaj poprawny adres e-mail.",
                    password: "Hasło musi zawierać co najmniej 8 znaków, w tym jedną literę i jedną cyfrę.",
                    confirmPassword: "Hasła nie są zgodne.",
                    zipCode: "Podaj poprawny kod pocztowy w formacie 00-000.",
                    city: "Miasto może zawierać tylko litery i spacje.",
                    street: "Ulica może zawierać tylko litery, spacje i myślniki.",
                    houseNumber: "Podaj poprawny numer domu.",
                    flatNumber: "Podaj poprawny numer mieszkania lub pozostaw puste."
                }[field] || `Niepoprawny format: ${field}`;
            }
        }

        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Hasła nie są zgodne.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInput()) return;

        try {
            const registerData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthDay: formData.birthDay,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                password: formData.password,
                zipCode: formData.zipCode,
                city: formData.city,
                street: formData.street,
                houseNumber: formData.houseNumber,
                flatNumber: formData.flatNumber.trim() === "" ? 0 : Number(formData.flatNumber)
            };

            const response = await createAPIEndpoint(ENDPOINTS.CLIENT_REGISTER).register(registerData);
            if (response.status === 201) {
                alert("Rejestracja zakończona sukcesem!");
                navigate('/login');
            } else {
                setErrors({ server: response.data.message || "Nie udało się zarejestrować." });
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
            setErrors({ server: "Błąd połączenia z serwerem." });
        }
    };

    return (
        <div className="div-form">
            <div className="container my-5">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Rejestracja</h2>
                            {errors.server && <p className="alert alert-danger">{errors.server}</p>}
                            <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
                                {Object.keys(formData).map((key) => (
                                    <div className="mb-3" key={key}>
                                        <label htmlFor={key} className="form-label">
                                            {placeholders[key]}
                                        </label>
                                        <input
                                            type={key.includes("password") || key === "confirmPassword" ? "password" : key === "birthDay" ? "date" : "text"}
                                            id={key}
                                            name={key}
                                            className="form-control"
                                            placeholder={placeholders[key]}
                                            value={formData[key]}
                                            onChange={handleChange}
                                        />
                                        {errors[key] && <p className="text-danger">{errors[key]}</p>}
                                    </div>
                                ))}
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
