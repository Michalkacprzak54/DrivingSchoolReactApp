import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";

function ChangePasswordEmployee() {
    const { IdEmployee } = useParams(); // Pobranie ID pracownika z URL
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (newPassword.length < 6) {
            setError("Hasło musi mieć co najmniej 6 znaków.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Hasła nie są identyczne.");
            return;
        }

        const passwordData = {
            newPassword: newPassword, // Obiekt JSON z nowym hasłem
        };

        try {
            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA + "/changeInstructorPassword").update(IdEmployee, passwordData);

            if (response.status === 200) {
                setSuccessMessage("Hasło zostało pomyślnie zmienione!");
                setTimeout(() => navigate("/employeePage"), 2000);
            } else {
                setError(response.data.message || "Nie udało się zmienić hasła.");
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Zmień Hasło</h2>

                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nowe Hasło</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Potwierdź Hasło</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Zmień Hasło
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordEmployee;
