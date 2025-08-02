/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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
  const [error, setError] = useState(null);
  const [fileNames, setFileNames] = useState({
    resume: "",
    profile_picture: "",
  });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const dismissError = () => {
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
      setSuccess("Registration successful! Redirecting to login...");

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
      setFileNames({
        resume: "",
        profile_picture: "",
      });

      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create profile. Please try again."
      );
    }
  };

  return (
    <div className="registration-container">
      <ToastContainer
        className="toast-class text-light"
        position="top-center"
        autoClose={2000}
        style={{ zIndex: 10000 }}
        toastStyle={{ backgroundColor: "#333" }}
      />

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
          {error && (
            <div className="error-alert">
              <span>{error}</span>
              <button onClick={dismissError} className="close-alert">
                <FaTimes />
              </button>
            </div>
          )}
          {success && (
            <div className="success-alert">
              <span>{success}</span>
              <button onClick={() => setSuccess(null)} className="close-alert">
                <FaTimes />
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="registration-form">
            <h3>Create Your Account</h3>
            <p className="form-subtitle">Fill out the form to get started</p>

            <div className="input-group">
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
            </div>

            <div className="input-group">
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
            </div>

            <div className="input-group">
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
            </div>

            <div className="input-group">
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
            </div>

            <div className="input-group">
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
            </div>

            <div className="input-group password-group">
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
            </div>

            <button type="submit" className="submit-btn">
              Create Account
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
