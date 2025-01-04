import React, { useState } from "react";
import UserProfile from "./userProfile";
import { createAPIEndpoint, ENDPOINTS } from "../api/index";

const ChangePassword = () => {
/*    const [activeSubTab, setActiveSubTab] = useState("editData"); */
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState(null);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Nowe hasło i potwierdzenie muszą być takie same.");
            return;
        }

        try {
            await createAPIEndpoint(ENDPOINTS.CLIENT + "/ChangePassword").post({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            alert("Hasło zostało zmienione!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setPasswordError(null);
        } catch (err) {
            setPasswordError(err.response?.data?.message || "Błąd zmiany hasła.");
        }
    };

    return (
        <div>
            <div className="tab-content mt-4">
                <div>
                    <h5>Zmień hasło</h5>
                    <div className="mb-3">
                        <label htmlFor="oldPassword" className="form-label">Stare hasło</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            className="form-control"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">Nowe hasło</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="form-control"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Potwierdź nowe hasło</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    {passwordError && <p className="text-danger">{passwordError}</p>}
                    <button className="btn btn-primary" onClick={handlePasswordSubmit}>
                        Zmień hasło
                    </button>
                </div>        
            </div>
        </div>
    );
};

export default ChangePassword;
