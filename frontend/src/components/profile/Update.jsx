import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    skills: "",
    resume: null,
    profile_picture: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the page has been refreshed already
    const firstRefresh = sessionStorage.getItem("firstRefresh");
    if (!firstRefresh) {
      sessionStorage.setItem("firstRefresh", "true");
      window.location.reload();
      return; // Prevent further execution on the first load
    }

    // Check for candidate data in sessionStorage
    const storedUserData = sessionStorage.getItem("candidateData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setFormData({
        full_name: parsedData.full_name,
        email: parsedData.email,
        phone_number: parsedData.phone_number,
        location: parsedData.location,
        skills: parsedData.skills,
        resume: parsedData.resume,
        profile_picture: parsedData.profile_picture,
      });
    } else {
      // Redirect to the sign-in page if no user data exists
      navigate("/signin");
    }
  }, [navigate]);

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

    // Retrieve the candidate ID from sessionStorage
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));
    const candidateId = candidateData ? candidateData.id : null;

    if (!candidateId) {
      toast.error("Candidate ID is missing.");
      return;
    }

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("phone_number", formData.phone_number);
    data.append("location", formData.location);
    data.append("skills", formData.skills);

    if (formData.resume instanceof File) {
      data.append("resume", formData.resume);
    }
    if (formData.profile_picture instanceof File) {
      data.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/candidate/update/${candidateId}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");

        // Save the updated candidate data to sessionStorage
        sessionStorage.setItem(
          "candidateData",
          JSON.stringify(response.data.candidate)
        );

        // Update state with the latest data
        setUserData(response.data.candidate);
        setFormData({
          full_name: response.data.candidate.full_name,
          email: response.data.candidate.email,
          phone_number: response.data.candidate.phone_number,
          location: response.data.candidate.location,
          skills: response.data.candidate.skills,
          resume: response.data.candidate.resume,
          profile_picture: response.data.candidate.profile_picture,
        });

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    }
  };

  if (!userData) return <div>Loading...</div>;

  const defaultProfilePicture = "profile.jpg";
  const profileImage = userData.profile_picture
    ? `http://localhost:8000${userData.profile_picture}`
    : defaultProfilePicture;
  const resumeLink = userData.resume
    ? `http://localhost:8000${userData.resume}`
    : null;

  return (
    <div className="profile-container">
      <ToastContainer
        className="toast-class"
        position="top-center"
        autoClose={2000}
      />

      <div className="profile-details">
        <form
          onSubmit={handleSubmit}
          className="update-profile-form p-4 shadow-sm rounded"
        >
          <h3 className="text-center mb-4">Update Profile</h3>
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
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;





// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Profile.css";

// const Profile = () => {
//   const [userData, setUserData] = useState(null);
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     location: "",
//     skills: "",
//     resume: null,
//     profile_picture: null,
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if the page has been refreshed already
//     const firstRefresh = sessionStorage.getItem("firstRefresh");
//     if (!firstRefresh) {
//       sessionStorage.setItem("firstRefresh", "true");
//       window.location.reload();
//       return; // Prevent further execution on the first load
//     }

//     // Check for candidate data in sessionStorage
//     const storedUserData = sessionStorage.getItem("candidateData");
//     if (storedUserData) {
//       const parsedData = JSON.parse(storedUserData);
//       setUserData(parsedData);
//       setFormData({
//         full_name: parsedData.full_name,
//         email: parsedData.email,
//         phone_number: parsedData.phone_number,
//         location: parsedData.location,
//         skills: parsedData.skills,
//         resume: parsedData.resume,
//         profile_picture: parsedData.profile_picture,
//       });
//     } else {
//       // Redirect to the sign-in page if no user data exists
//       navigate("/signin");
//     }
//   }, [navigate]);

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

//     // Retrieve the candidate ID from sessionStorage
//     const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));
//     const candidateId = candidateData ? candidateData.id : null;

//     if (!candidateId) {
//       toast.error("Candidate ID is missing.");
//       return;
//     }

//     const data = new FormData();
//     data.append("full_name", formData.full_name);
//     data.append("email", formData.email);
//     data.append("phone_number", formData.phone_number);
//     data.append("location", formData.location);
//     data.append("skills", formData.skills);

//     if (formData.resume instanceof File) {
//       data.append("resume", formData.resume);
//     }
//     if (formData.profile_picture instanceof File) {
//       data.append("profile_picture", formData.profile_picture);
//     }



//     console.log("FormData contents:");
//     for (let [key, value] of data.entries()) {
//       if (value instanceof File) {
//         console.log(`${key}: File - ${value.name}`);
//       } else {
//         console.log(`${key}: ${value}`);
//       }
//     }
    
//     try {
//       const response = await axios.put(
//         `http://localhost:8000/api/candidate/update/${candidateId}/`, // Use candidateId in the URL
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       // If the update was successful, update the sessionStorage and state
//       if (response.status === 200) {
//         // Assuming the backend returns the updated profile with file paths
//         const updatedData = { 
//           ...formData, 
//           id: candidateId, 
//           ...response.data 
//         };

//         // Update sessionStorage with the new data, including file paths
//         sessionStorage.setItem("candidateData", JSON.stringify(updatedData));

//         // Update the state with the new data
//         setUserData(updatedData);

//         toast.success("Profile updated successfully!");

//         // Navigate after a short delay
//         setTimeout(() => {
//           navigate("/dashboard");
//         }, 2500);
//       } else {
//         toast.error("Failed to update profile.");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Error updating profile.");
//     }
//   };

//   if (!userData) return <div>Loading...</div>;

//   const defaultProfilePicture = "profile.jpg";
//   const profileImage = userData.profile_picture
//     ? `http://localhost:8000${userData.profile_picture}`
//     : defaultProfilePicture;
//   const resumeLink = userData.resume
//     ? `http://localhost:8000${userData.resume}`
//     : null;

//   return (
//     <div className="profile-container">
//       <ToastContainer
//         className="toast-class"
//         position="top-center"
//         autoClose={2000}
//       />

//       <div className="profile-details">
//         <form
//           onSubmit={handleSubmit}
//           className="update-profile-form p-4 shadow-sm rounded"
//         >
//           <h3 className="text-center mb-4">Update Profile</h3>
//           <input
//             type="text"
//             name="full_name"
//             onChange={handleChange}
//             placeholder="Full Name"
//             value={formData.full_name}
//             required
//             className="form-control mb-3"
//           />
//           <input
//             type="email"
//             name="email"
//             onChange={handleChange}
//             placeholder="Email"
//             value={formData.email}
//             required
//             className="form-control mb-3"
//           />
//           <input
//             type="text"
//             name="phone_number"
//             onChange={handleChange}
//             placeholder="Phone Number"
//             value={formData.phone_number}
//             required
//             className="form-control mb-3"
//           />
//           <input
//             type="text"
//             name="location"
//             onChange={handleChange}
//             placeholder="Location"
//             value={formData.location}
//             required
//             className="form-control mb-3"
//           />
//           <textarea
//             name="skills"
//             onChange={handleChange}
//             placeholder="Skills (comma-separated)"
//             value={formData.skills}
//             required
//             className="form-control mb-3"
//           ></textarea>
//           <label className="text-dark">Resume</label>
//           <input
//             type="file"
//             name="resume"
//             onChange={handleFileChange}
//             accept=".pdf"
//             className="form-control mb-3"
//           />
//           <label className="text-dark">Profile image</label>
//           <input
//             type="file"
//             name="profile_picture"
//             onChange={handleFileChange}
//             accept="image/*"
//             className="form-control mb-4"
//           />
//           <button type="submit" className="btn btn-primary w-100">
//             Update Profile
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;
