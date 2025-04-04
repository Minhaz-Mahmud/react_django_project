import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../signin/Signin.css";

const ChangePassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const { id: candidateId } = useParams();

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!candidateId) {
            toast.error("Candidate ID is missing.");
            return;
        }

        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/candidate/cp/${candidateId}/`, 
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

export default ChangePassword;



// import { useState } from "react";
// import { useParams } from "react-router-dom"; // Import useParams to get the ID from the URL
// import axios from "axios";
// import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

// const ChangePassword = () => {
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
    
//     // Get the candidate ID from the URL
//     const { id: candidateId } = useParams();

//     const handlePasswordChange = async (e) => {
//         e.preventDefault();

//         if (!candidateId) {
//             toast.error("Candidate ID is missing.");
//             return;
//         }

//         try {
//             const response = await axios.put(
//                 `http://127.0.0.1:8000/api/candidate/cp/${candidateId}/`, 
//                 { password },
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             setMessage(response.data.message);
//             toast.success("Password updated successfully!");
//             setPassword(""); // Clear the input field
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Failed to update password.";
//             setMessage(errorMessage);
//             toast.error(errorMessage);
//         }
//     };

//     return (
//         <div>
//             <br /><br /><br /><br /><br />
//             <h2>Change Password</h2>
//             <form onSubmit={handlePasswordChange}>
//                 <input
//                     type="password"
//                     placeholder="New Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Update Password</button>
//             </form>
//             {message && <p>{message}</p>}
//             <br /><br /><br /><br /><br />
//         </div>
//     );
// };

// export default ChangePassword;




// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

// const ChangePassword = () => {
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");

//     // Retrieve the candidate ID from sessionStorage
//     const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));
//     const candidateId = candidateData ? candidateData.id : null;

//     const handlePasswordChange = async (e) => {
//         e.preventDefault();

//         if (!candidateId) {
//             toast.error("Candidate ID is missing.");
//             return;
//         }

//         try {
//             const response = await axios.put(
//                 `http://127.0.0.1:8000/api/candidate/cp/${candidateId}/`, 
//                 { password },
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             setMessage(response.data.message);
//             toast.success("Password updated successfully!");
//             setPassword(""); // Clear the input field
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Failed to update password.";
//             setMessage(errorMessage);
//             toast.error(errorMessage);
//         }
//     };

//     return (
//         <div>
//             <br /><br /><br /><br /><br />
//             <h2>Change Password</h2>
//             <form onSubmit={handlePasswordChange}>
//                 <input
//                     type="password"
//                     placeholder="New Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Update Password</button>
//             </form>
//             {message && <p>{message}</p>}
//             <br /><br /><br /><br /><br />
//         </div>
        
//     );
// };

// export default ChangePassword;
