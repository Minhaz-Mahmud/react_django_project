import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../signin/Signin.css";

const ChangePasswordCompany = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const { id: companyId } = useParams();

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!companyId) {
            toast.error("Company ID is missing.");
            return;
        }

        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/company/cp/${companyId}/`, 
                { password },
                { headers: { "Content-Type": "application/json" } }
            );

            setMessage(response.data.message);
            toast.success("Password updated successfully!");
            setPassword("");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update password.";
            setMessage(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form-container">
                <h2 className="signin-header">Forgot Password?</h2>
                <form onSubmit={handlePasswordChange} className="signin-form">
                    <div className="form-group">
                        <label htmlFor="password"> Enter New Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="signin-button">Update Password</button>
                </form>
                {message && <p className="signup-option">{message}</p>}
            </div>
        </div>
    );
};

export default ChangePasswordCompany;


