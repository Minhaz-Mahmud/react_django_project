import React, { useState } from "react";
import axios from "axios";

const CPMail = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/send-email/", {
                receiver: email,
            });
            setMessage("Email sent successfully!");
        } catch (error) {
            setMessage("Failed to send email. Please try again.");
            console.error(error);
        }
    };

    return (
        <div>
            <br /><br /><br /><br /><br />
            <h1>Candidate Email</h1>
            <h2>Send Email</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send</button>
            </form>
            {message && <p>{message}</p>}
            <br /><br /><br /><br /><br />
        </div>
    );
};

export default CPMail;