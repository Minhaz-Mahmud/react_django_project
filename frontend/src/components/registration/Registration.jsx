// import { useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Registration.css";

// const Registration = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     location: "",
//     skills: "",
//     resume: null,
//     profile_picture: null,
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files[0],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append("full_name", formData.full_name);
//     data.append("email", formData.email);
//     data.append("phone_number", formData.phone_number);
//     data.append("location", formData.location);
//     data.append("skills", formData.skills);
//     data.append("password", formData.password);

//     if (formData.resume instanceof File) {
//       data.append("resume", formData.resume);
//     }
//     if (formData.profile_picture instanceof File) {
//       data.append("profile_picture", formData.profile_picture);
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/candidates/",
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log("Candidate created:", response.data);
//       toast.success("Candidate created successfully!");

//       // Clear the form fields
//       setFormData({
//         full_name: "",
//         email: "",
//         phone_number: "",
//         location: "",
//         skills: "",
//         resume: null,
//         profile_picture: null,
//         password: "",
//       });

//       // Redirect to home page after a delay
//       setTimeout(() => {
//         navigate("/");
//       }, 3000);
//     } catch (error) {
//       console.error("Error creating candidate:", error);
//       toast.error("Failed to create candidate.");
//     }
//   };

//   return (
//     <div className="main-reg-div container my-5">
//       <ToastContainer
//         position="top-center"
//         autoClose={2000}
//       />
//       <div className="row justify-content-center align-items-center">
//         <div className="col-md-6">
//           <img
//             src="/assets/bg.jpg"
//             alt="Registration"
//             className="img-fluid registration-image"
//           />
//         </div>
//         <div className="col-md-6">
//           <form
//             onSubmit={handleSubmit}
//             className="registration-form p-4 shadow-sm rounded"
//           >
//             <h3 className="text-center mb-4">Candidate Registration</h3>
//             <input
//               type="text"
//               name="full_name"
//               onChange={handleChange}
//               placeholder="Full Name"
//               value={formData.full_name}
//               required
//               className="form-control mb-3"
//             />
//             <input
//               type="email"
//               name="email"
//               onChange={handleChange}
//               placeholder="Email"
//               value={formData.email}
//               required
//               className="form-control mb-3"
//             />
//             <input
//               type="text"
//               name="phone_number"
//               onChange={handleChange}
//               placeholder="Phone Number"
//               value={formData.phone_number}
//               required
//               className="form-control mb-3"
//             />
//             <input
//               type="text"
//               name="location"
//               onChange={handleChange}
//               placeholder="Location"
//               value={formData.location}
//               required
//               className="form-control mb-3"
//             />
//             <textarea
//               name="skills"
//               onChange={handleChange}
//               placeholder="Skills (comma-separated)"
//               value={formData.skills}
//               required
//               className="form-control mb-3"
//             ></textarea>
//             <input
//               type="password"
//               name="password"
//               onChange={handleChange}
//               placeholder="Password"
//               value={formData.password}
//               required
//               className="form-control mb-3"
//             />
//             <label className="text-dark">Resume</label>
//             <input
//               type="file"
//               name="resume"
//               onChange={handleFileChange}
//               accept=".pdf"
//               className="form-control mb-3"
//             />
//             <label className="text-dark">Profile image</label>
//             <input
//               type="file"
//               name="profile_picture"
//               onChange={handleFileChange}
//               accept="image/*"
//               className="form-control mb-4"
//             />
//             <button type="submit" className="btn btn-primary w-100">
//               Submit
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Registration;

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Registration.css";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    skills: "",
    resume: null,
    profile_picture: null,
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("phone_number", formData.phone_number);
    data.append("location", formData.location);
    data.append("skills", formData.skills);
    data.append("password", formData.password);

    if (formData.resume instanceof File) {
      data.append("resume", formData.resume);
    }
    if (formData.profile_picture instanceof File) {
      data.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/candidates/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Candidate created:", response.data);
      toast.clearWaitingQueue();
      toast.success("Candidate created successfully!");

      // Clear the form fields
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        location: "",
        skills: "",
        resume: null,
        profile_picture: null,
        password: "",
      });

      // Redirect to home page after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.clearWaitingQueue();
      toast.error("Failed to create profile:" + error);
    }
  };

  return (
    <div className="main-reg-div container my-5">
      <ToastContainer
        className="toast-class"
        position="top-center"
        autoClose={2000}
      />

      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <img
            src="/assets/bg.jpg"
            alt="Registration"
            className="img-fluid registration-image"
          />
        </div>
        <div className="col-md-6">
          <form
            onSubmit={handleSubmit}
            className="registration-form p-4 shadow-sm rounded"
          >
            <h3 className="text-center mb-4">Candidate Registration</h3>
            <input
              type="text"
              name="full_name"
              onChange={handleChange}
              placeholder="Full Name"
              value={formData.full_name}
              required
              className="form-control mb-3"
            />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              value={formData.email}
              required
              className="form-control mb-3"
            />
            <input
              type="text"
              name="phone_number"
              onChange={handleChange}
              placeholder="Phone Number"
              value={formData.phone_number}
              required
              className="form-control mb-3"
            />
            <input
              type="text"
              name="location"
              onChange={handleChange}
              placeholder="Location"
              value={formData.location}
              required
              className="form-control mb-3"
            />
            <textarea
              name="skills"
              onChange={handleChange}
              placeholder="Skills (comma-separated)"
              value={formData.skills}
              required
              className="form-control mb-3"
            ></textarea>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              value={formData.password}
              required
              className="form-control mb-3"
            />
            <label className="text-dark">Resume</label>
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf"
              className="form-control mb-3"
            />
            <label className="text-dark">Profile image</label>
            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              accept="image/*"
              className="form-control mb-4"
            />
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
