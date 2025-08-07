import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTools,
  FaLock,
  FaFileAlt,
  FaImage,
} from "react-icons/fa";
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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileNames, setFileNames] = useState({
    resume: "",
    profile_picture: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setFileNames({
        ...fileNames,
        [name]: files[0].name,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dismissMessage = () => {
    setApiMessage({ text: "", type: "" });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrors({});
  setApiMessage({ text: "", type: "" });

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

    // ✅ Success
    setApiMessage({
      text: response.data.message || "Registration successful!",
      type: "success",
    });

    // Clear form
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

    setFileNames({
      resume: "",
      profile_picture: "",
    });

    // Redirect after short delay
    setTimeout(() => navigate("/signin"), 3000);
  } catch (error) {
    console.error("Registration error:", error);

    if (error.response) {
      // ✅ Validation errors
      if (error.response.data?.errors) {
        setErrors(error.response.data.errors);

        const allErrors = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(" | ");

        setApiMessage({
          text: allErrors,
          type: "error"
        });
      }
      // ✅ Other known backend message
      else if (error.response.data?.message) {
        setApiMessage({
          text: error.response.data.message,
          type: "error"
        });

        if (error.response.data.error === 'duplicate_email') {
          setErrors({ email: error.response.data.message });
        }
      }
    } 
    // ✅ No backend response
    else if (error.request) {
      setApiMessage({
        text: "No response from server. Please try again later.",
        type: "error"
      });
    } 
    // ✅ Unexpected error
    else {
      setApiMessage({
        text: "An unexpected error occurred. Please try again.",
        type: "error"
      });
    }
  } finally {
    setIsSubmitting(false);
  }
};


  const getInputClass = (fieldName) => {
    return errors[fieldName] ? "input-group has-error" : "input-group";
  };

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        <div className="registration-image-container">
          <div className="image-overlay">
            <h2>Join Our Talent Network</h2>
            <p>
              Find your dream job with our platform. Connect with top employers
              and showcase your skills.
            </p>
          </div>
          <img
            src="/assets/bg.jpg"
            alt="Registration"
            className="registration-image"
          />
        </div>

        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">
            <h3>Create Your Account</h3>
            
          {apiMessage.text && (
  <div
    style={{
      backgroundColor: apiMessage.type === 'success' ? '#d4edda' : '#f8d7da',
      color: apiMessage.type === 'success' ? '#155724' : '#721c24',
      padding: '12px 16px',
      borderRadius: '5px',
      border: `1px solid ${apiMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
      marginTop: '10px',
      fontWeight: 500,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    {apiMessage.text}
    <button onClick={dismissMessage} className="close-message">
      <FaTimes />
    </button>
  </div>
)}


            <p className="form-subtitle">Fill out the form to get started</p>

            <div className={getInputClass("full_name")}>
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                name="full_name"
                onChange={handleChange}
                placeholder="Full Name"
                value={formData.full_name}
                required
              />
              {errors.full_name && (
                <div className="field-error-message">
                  {errors.full_name}
                </div>
              )}
            </div>

            <div className={getInputClass("email")}>
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email Address"
                value={formData.email}
                required
              />
              {/* {errors.email && (
                <div className="field-error-message">
                  {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                </div>
              )} */}
            </div>

            <div className={getInputClass("phone_number")}>
              <div className="input-icon">
                <FaPhone />
              </div>
              <input
                type="text"
                name="phone_number"
                onChange={handleChange}
                placeholder="Phone Number"
                value={formData.phone_number}
                required
              />
              {errors.phone_number && (
                <div className="field-error-message">
                  {Array.isArray(errors.phone_number) ? errors.phone_number[0] : errors.phone_number}
                </div>
              )}
            </div>

            <div className={getInputClass("location")}>
              <div className="input-icon">
                <FaMapMarkerAlt />
              </div>
              <input
                type="text"
                name="location"
                onChange={handleChange}
                placeholder="Your Location"
                value={formData.location}
                required
              />
              {errors.location && (
                <div className="field-error-message">
                  {Array.isArray(errors.location) ? errors.location[0] : errors.location}
                </div>
              )}
            </div>

            <div className={getInputClass("skills")}>
              <div className="input-icon">
                <FaTools />
              </div>
              <textarea
                name="skills"
                onChange={handleChange}
                placeholder="Skills (comma-separated)"
                value={formData.skills}
                required
              ></textarea>
              {errors.skills && (
                <div className="field-error-message">
                  {Array.isArray(errors.skills) ? errors.skills[0] : errors.skills}
                </div>
              )}
            </div>

            <div className={`password-group ${getInputClass("password")}`}>
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                placeholder="Password"
                value={formData.password}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <div className="field-error-message">
                  {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                </div>
              )}
            </div>

            <div className="file-input-group">
              <label>
                <div className="file-input-label">
                  <FaFileAlt />
                  <span>{fileNames.resume || "Upload Resume (PDF)"}</span>
                </div>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden-file-input"
                />
              </label>
              {errors.resume && (
                <div className="field-error-message">
                  {Array.isArray(errors.resume) ? errors.resume[0] : errors.resume}
                </div>
              )}
            </div>

            <div className="file-input-group">
              <label>
                <div className="file-input-label">
                  <FaImage />
                  <span>
                    {fileNames.profile_picture || "Upload Profile Picture"}
                  </span>
                </div>
                <input
                  type="file"
                  name="profile_picture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden-file-input"
                />
              </label>
              {errors.profile_picture && (
                <div className="field-error-message">
                  {Array.isArray(errors.profile_picture) ? errors.profile_picture[0] : errors.profile_picture}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Create Account"}
            </button>

            <div className="login-link">
              Already have an account? <Link to="/signin">Sign In</Link>
            </div>
          </form>

          <div className="company-registration">
            <h4>Are you hiring?</h4>
            <Link to="/company-register" className="company-btn">
              Register Your Company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;