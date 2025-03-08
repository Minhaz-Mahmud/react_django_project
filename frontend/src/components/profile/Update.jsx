import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BsPersonCircle,
  BsFileEarmarkText,
  BsGeoAlt,
  BsPhone,
  BsEnvelope,
  BsTools,
} from "react-icons/bs";
import "./Update.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
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
      return;
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

      // Set preview image if exists
      if (parsedData.profile_picture) {
        setPreviewImage(`http://localhost:8000${parsedData.profile_picture}`);
      }

      setLoading(false);
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

    // Create preview URL for profile picture
    if (name === "profile_picture" && files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      fileReader.readAsDataURL(files[0]);
    }
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
      toast.error(error.response?.data?.message || "Error updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const defaultProfilePicture = "profile.jpg";
  const resumeLink = userData.resume
    ? `http://localhost:8000${userData.resume}`
    : null;

  return (
    <div className="update-profile-container py-5">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow">
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-0 text-center">Update Your Profile</h3>
              </div>

              <div className="card-body p-4">
                <div className="row">
                  {/* Left Side - Image Preview */}
                  <div className="col-md-4 mb-4 mb-md-0">
                    <div className="text-center">
                      <div className="profile-preview-container mx-auto mb-3">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile Preview"
                            className="profile-preview-image"
                            onError={(e) => {
                              e.target.src = defaultProfilePicture;
                            }}
                          />
                        ) : (
                          <div className="default-profile-preview">
                            <BsPersonCircle size={80} />
                          </div>
                        )}
                      </div>

                      <div className="current-document mb-4">
                        <h6 className="fw-bold text-muted">Current Resume</h6>
                        {resumeLink ? (
                          <a
                            href={resumeLink}
                            className="btn btn-sm btn-outline-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <BsFileEarmarkText className="me-1" /> View Current
                            Resume
                          </a>
                        ) : (
                          <p className="text-muted small">No resume uploaded</p>
                        )}
                      </div>

                      <div className="update-instructions">
                        <div className="alert alert-info">
                          <small>
                            Update your information and click &quot;Save
                            Changes&quot; to update your profile.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Side - Form */}
                  <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label
                          htmlFor="full_name"
                          className="form-label fw-semibold"
                        >
                          <BsPersonCircle className="me-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          className="form-control"
                          onChange={handleChange}
                          placeholder="Your full name"
                          value={formData.full_name}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="phone_number"
                          className="form-label fw-semibold"
                        >
                          <BsPhone className="me-2" />
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone_number"
                          name="phone_number"
                          className="form-control"
                          onChange={handleChange}
                          placeholder="Your phone number"
                          value={formData.phone_number}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="location"
                          className="form-label fw-semibold"
                        >
                          <BsGeoAlt className="me-2" />
                          Address
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          className="form-control"
                          onChange={handleChange}
                          placeholder="Your location"
                          value={formData.location}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="skills"
                          className="form-label fw-semibold"
                        >
                          <BsTools className="me-2" />
                          Skills
                        </label>
                        <textarea
                          id="skills"
                          name="skills"
                          className="form-control"
                          onChange={handleChange}
                          placeholder="Your skills (comma-separated)"
                          value={formData.skills}
                          required
                          rows="3"
                        ></textarea>
                        <small className="form-text text-muted">
                          List your skills separated by commas (e.g.,
                          JavaScript, React, Node.js)
                        </small>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="resume"
                            className="form-label fw-semibold"
                          >
                            <BsFileEarmarkText className="me-2" />
                            Resume
                          </label>
                          <input
                            type="file"
                            id="resume"
                            name="resume"
                            className="form-control"
                            onChange={handleFileChange}
                            accept=".pdf"
                          />
                          <small className="form-text text-muted">
                            Upload a PDF file
                          </small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="profile_picture"
                            className="form-label fw-semibold"
                          >
                            <BsPersonCircle className="me-2" />
                            Profile Picture
                          </label>
                          <input
                            type="file"
                            id="profile_picture"
                            name="profile_picture"
                            className="form-control"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                          <small className="form-text text-muted">
                            JPEG, PNG, or GIF
                          </small>
                        </div>
                      </div>

                      <div className="mt-4 d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary px-4">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
