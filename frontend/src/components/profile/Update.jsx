import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BsPersonCircle,
  BsFileEarmarkText,
  BsBook,
  BsBuilding,
  BsBriefcase,
} from "react-icons/bs";
import "./Update.css";

const ProfileUpdate = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    dob: "",
    gender: "",
    religion: "",
    high_school_name: "",
    high_school_degree: "",
    high_school_passing_year: "",
    high_school_grade: "",
    university_name: "",
    university_degree: "",
    university_passing_year: "",
    university_grade: "",
    professional_experience: "",
    skills: "",
    resume: null,
    profile_picture: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("candidateData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);

      setFormData({
        full_name: parsedData.full_name || "",
        email: parsedData.email || "",
        phone_number: parsedData.phone_number || "",
        location: parsedData.location || "",
        dob: parsedData.dob || "",
        gender: parsedData.gender || "",
        religion: parsedData.religion || "",
        high_school_name: parsedData.high_school_name || "",
        high_school_degree: parsedData.high_school_degree || "",
        high_school_passing_year: parsedData.high_school_passing_year || "",
        high_school_grade: parsedData.high_school_grade || "",
        university_name: parsedData.university_name || "",
        university_degree: parsedData.university_degree || "",
        university_passing_year: parsedData.university_passing_year || "",
        university_grade: parsedData.university_grade || "",
        professional_experience: parsedData.professional_experience || "",
        skills: parsedData.skills || "",
        resume: null,
        profile_picture: null,
      });

      if (parsedData.profile_picture) {
        setPreviewImage(`http://localhost:8000${parsedData.profile_picture}`);
      }

      setLoading(false);
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Show preview for profile picture
      if (name === "profile_picture") {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        fileReader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const candidateId = userData?.id;

    console.log("userData from update:", userData);
    console.log("Candidate ID:", candidateId);

    if (!candidateId) {
      toast.error("Candidate ID is missing.");
      return;
    }

    const data = new FormData();

    // Add all form fields to FormData
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (key === "resume" || key === "profile_picture") {
        if (value instanceof File) {
          data.append(key, value);
        }
      } else if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    });

    // Debug: Log FormData contents
    console.log("Sending FormData:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
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

      console.log("Response:", response);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");

        // Update sessionStorage with new data
        sessionStorage.setItem(
          "candidateData",
          JSON.stringify(response.data.candidate)
        );
        setUserData(response.data.candidate);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Error updating profile.";
      toast.error(errorMessage);
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

  const resumeLink = userData?.resume
    ? `http://localhost:8000${userData.resume}`
    : null;

  return (
    <div className="update-profile-container py-5">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card border-0 shadow">
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-0 text-center">Update Your Profile</h3>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Left Column - Personal Info */}
                    <div className="col-md-6">
                      <h5 className="mb-3 text-primary">
                        <BsPersonCircle className="me-2" />
                        Personal Information
                      </h5>

                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="full_name"
                          className="form-control"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          name="phone_number"
                          className="form-control"
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          name="location"
                          className="form-control"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            name="dob"
                            className="form-control"
                            value={formData.dob}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Gender</label>
                          <select
                            name="gender"
                            className="form-select"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Religion</label>
                        <input
                          type="text"
                          name="religion"
                          className="form-control"
                          value={formData.religion}
                          onChange={handleChange}
                        />
                      </div>

                      <h5 className="mb-3 mt-4 text-primary">
                        <BsBriefcase className="me-2" />
                        Professional Information
                      </h5>

                      <div className="mb-3">
                        <label className="form-label">Skills</label>
                        <textarea
                          name="skills"
                          className="form-control"
                          value={formData.skills}
                          onChange={handleChange}
                          rows="3"
                          required
                        />
                        <small className="text-muted">
                          Comma-separated list
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Professional Experience
                        </label>
                        <textarea
                          name="professional_experience"
                          className="form-control"
                          value={formData.professional_experience}
                          onChange={handleChange}
                          rows="4"
                        />
                      </div>
                    </div>

                    {/* Right Column - Education & Files */}
                    <div className="col-md-6">
                      <h5 className="mb-3 text-primary">
                        <BsBook className="me-2" />
                        Education - High School
                      </h5>

                      <div className="mb-3">
                        <label className="form-label">High School Name</label>
                        <input
                          type="text"
                          name="high_school_name"
                          className="form-control"
                          value={formData.high_school_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Degree</label>
                          <input
                            type="text"
                            name="high_school_degree"
                            className="form-control"
                            value={formData.high_school_degree}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Passing Year</label>
                          <input
                            type="number"
                            name="high_school_passing_year"
                            className="form-control"
                            value={formData.high_school_passing_year}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Grade</label>
                          <input
                            type="text"
                            name="high_school_grade"
                            className="form-control"
                            value={formData.high_school_grade}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <h5 className="mb-3 mt-4 text-primary">
                        <BsBuilding className="me-2" />
                        Education - University
                      </h5>

                      <div className="mb-3">
                        <label className="form-label">University Name</label>
                        <input
                          type="text"
                          name="university_name"
                          className="form-control"
                          value={formData.university_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Degree</label>
                          <input
                            type="text"
                            name="university_degree"
                            className="form-control"
                            value={formData.university_degree}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Passing Year</label>
                          <input
                            type="number"
                            name="university_passing_year"
                            className="form-control"
                            value={formData.university_passing_year}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Grade</label>
                          <input
                            type="text"
                            name="university_grade"
                            className="form-control"
                            value={formData.university_grade}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <h5 className="mb-3 mt-4 text-primary">
                        <BsFileEarmarkText className="me-2" />
                        Documents
                      </h5>

                      <div className="mb-3">
                        <label className="form-label">Profile Picture</label>
                        <input
                          type="file"
                          name="profile_picture"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        {previewImage && (
                          <div className="mt-2 text-center">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="img-thumbnail"
                              style={{ maxWidth: "150px" }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Resume</label>
                        <input
                          type="file"
                          name="resume"
                          className="form-control"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                        {resumeLink && (
                          <div className="mt-2">
                            <a
                              href={resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              View Current Resume
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button type="submit" className="btn btn-primary px-4 me-2">
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
  );
};

export default ProfileUpdate;
