import React, { useState } from "react";
import axios from "axios";
import "../signin/Signin.css";

const CPMailCompany = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/send-recovery-company/", {
                receiver: email,
            });
            setMessage("A recovery link was sent to your email!");
        } catch (error) {
            setMessage("Failed to send email. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form-container">
                <h1 className="signin-header">Company Account</h1>
                <h2 className="signin-header">Recovery</h2>
                <form onSubmit={handleSubmit} className="signin-form">
                    <div className="form-group">
                        <label htmlFor="email"> Enter Your Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="signin-button">ENTER</button>
                </form>
                {message && <p className="signup-option">{message}</p>}
            </div>
        </div>
    );
};

export default CPMailCompany;





