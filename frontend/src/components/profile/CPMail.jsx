import React, { useState } from "react";
import axios from "axios";
import "../signin/Signin.css";

const CPMail = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/send-recovery/", {
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
                <h1 className="signin-header">Candidate Account</h1>
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

export default CPMail;




// import React, { useState } from "react";
// import axios from "axios";

// const CPMail = () => {
//     const [email, setEmail] = useState("");
//     const [message, setMessage] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post("http://localhost:8000/api/send-email/", {
//                 receiver: email,
//             });
//             setMessage("Email sent successfully!");
//         } catch (error) {
//             setMessage("Failed to send email. Please try again.");
//             console.error(error);
//         }
//     };

//     return (
//         <div>
//             <br /><br /><br /><br /><br />
//             <h1>Candidate Email</h1>
//             <h2>Send Email</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="email"
//                     placeholder="Enter email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Send</button>
//             </form>
//             {message && <p>{message}</p>}
//             <br /><br /><br /><br /><br />
//         </div>
//     );
// };

// export default CPMail;


// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "../signin/Signin.css";

// const CPMail = () => {
//     const [email, setEmail] = useState("");
//     const [message, setMessage] = useState("");
//     const [responseData, setResponseData] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post("http://localhost:8000/api/send-email/", {
//                 receiver: email,
//             });
//             setMessage("Email sent successfully!");
//             setResponseData(response.data);
//             toast.success("Email sent successfully!");
//         } catch (error) {
//             setMessage("Failed to send email. Please try again.");
//             setResponseData(error.response?.data || { error: "Unknown error occurred." });
//             toast.error("Failed to send email. Please try again.");
//             console.error(error);
//         }
//     };

//     return (
//         <div className="signin-container">
//             <div className="signin-form-container">
//                 <h2 className="signin-header">Candidate Email</h2>
//                 <h3 className="signin-subheader">Send Email</h3>
//                 <form onSubmit={handleSubmit} className="signin-form">
//                     <div className="form-group">
//                         <label htmlFor="email">Enter Email</label>
//                         <input
//                             id="email"
//                             type="email"
//                             placeholder="Enter email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <button type="submit" className="signin-button">Send</button>
//                 </form>
//                 {message && <p className="signup-option">{message}</p>}
//                 {responseData && (
//                     <div className="response-container">
//                         <h4>Response:</h4>
//                         <pre>{JSON.stringify(responseData, null, 2)}</pre>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CPMail;
