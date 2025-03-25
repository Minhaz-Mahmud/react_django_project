/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { format, set } from "date-fns";
import axios from "axios";
import "./ResumeBuilder.css";

const ResumeBuilder = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    gender: "male",
    dob: "",
    address: "",
    religion: "",
    skillset: ["", "", "", "", ""],
    education: {
      highSchool: {
        name: "",
        degree: "",
        year: "",
        grade: "",
      },
      varsity: {
        name: "",
        degree: "",
        year: "",
        grade: "",
        cga: "",
        passingYear: "",
      },
    },
    experience: "",
  });
  const [resumes, setResumes] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

    if (!candidateData) {
      toast.error("Please log in to view your resumes.");
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/candidate/get/resumes/",
        {
          params: { candidate_id: candidateData.id },
        }
      );
      setResumes(response.data);
    } catch (e) {
      const errorMessage =
        e.response?.data?.error || "Failed to fetch resumes.";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skillset];
    newSkills[index] = value;
    setFormData({ ...formData, skillset: newSkills });
  };

  const handleEducationChange = (level, field, value) => {
    setFormData({
      ...formData,
      education: {
        ...formData.education,
        [level]: {
          ...formData.education[level],
          [field]: value,
        },
      },
    });
  };

  const handleDelete = async (resumeId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/delete_resume/${resumeId}/`
      );

      if (response.status === 200) {
        setResumes((prevList) =>
          prevList.filter((resume) => resume.id !== resumeId)
        );

        alert("Resume deleted successfully!");
        setSuccessMessage("Resume deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume. Please try again.");
      setErrorMessage("Failed to delete resume. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));
    const formDataWithId = { ...formData, candidate_id: candidateData.id };

    const response = await fetch("http://127.0.0.1:8000/api/generate-cv/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataWithId),
    });

    if (response.ok) {
      const result = await response.json();
      const downloadUrl = `http://127.0.0.1:8000${result.cv_url}`;
      setDownloadLink(downloadUrl);
      setModalIsOpen(false);
      setSuccessMessage("CV generated successfully");
      fetchResumes();
    } else {
      alert("Failed to generate CV");
      setErrorMessage("Failed to generate CV");
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));
    const formDataWithId = { ...formData, candidate_id: candidateData.id };

    const response = await fetch("http://127.0.0.1:8000/api/generate-cv2/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataWithId),
    });

    if (response.ok) {
      const result = await response.json();
      const downloadUrl = `http://127.0.0.1:8000${result.cv_url}`;
      setDownloadLink(downloadUrl);
      setModalIsOpen2(false);
      setSuccessMessage("CV generated successfully");
      fetchResumes();
    } else {
      alert("Failed to generate CV");
      setErrorMessage("Failed to generate CV");
    }
  };

  return (
    <div className="p-4 resume-main-div">
      <div className="m-4 template_div">
        {/* Image 1 */}
        <div className="template-1-div template-container">
          <img
            src="/assets/cv_temp1.jpg"
            alt="Template 1"
            className="m-auto img-fluid template-image"
          />
          <button
            onClick={() => setModalIsOpen(true)}
            className="btn position-absolute overlay-button"
          >
            Generate CV
          </button>
        </div>

        {/* Image 2 */}
        <div className="template-2-div template-container">
          <img
            src="/assets/cv_temp2.jpg"
            alt="Template 2"
            className="m-auto img-fluid template-image"
          />
          <button
            onClick={() => setModalIsOpen2(true)}
            className="btn position-absolute overlay-button"
          >
            Generate CV
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalIsOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="bg-light modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Your Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalIsOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <div className="mb-4">
                    <h5>Personal Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gender </label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Male</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Female</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="3"
                        required
                      />
                    </div>
                    {/* Religion */}
                    <div className="mb-4">
                      <h5>Religion</h5>
                      <textarea
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-4">
                    <h5>Professional Skills (Max 5)</h5>
                    <div className="row">
                      {formData.skillset.map((skill, index) => (
                        <div className="col-md-6 mb-3" key={index}>
                          <input
                            type="text"
                            placeholder={`Skill ${index + 1}`}
                            value={skill}
                            onChange={(e) =>
                              handleSkillChange(index, e.target.value)
                            }
                            className="form-control"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="mb-4">
                    <h5>Education</h5>

                    {/* High School */}
                    <div className="mb-4">
                      <h6>High School</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">School Name</label>
                          <input
                            type="text"
                            value={formData.education.highSchool.name}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "name",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            Certificate/Degree
                          </label>
                          <input
                            type="text"
                            value={formData.education.highSchool.degree}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "degree",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Year</label>
                          <input
                            type="text"
                            value={formData.education.highSchool.year}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "year",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Grade</label>
                          <input
                            type="text"
                            value={formData.education.highSchool.grade}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "grade",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* University */}
                    <div className="mb-4">
                      <h6>University</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">University Name</label>
                          <input
                            type="text"
                            value={formData.education.varsity.name}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "name",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Degree</label>
                          <input
                            type="text"
                            value={formData.education.varsity.degree}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "degree",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Passing Year</label>
                          <input
                            type="text"
                            value={formData.education.varsity.passingYear}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "passingYear",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">CGA</label>
                          <input
                            type="text"
                            value={formData.education.varsity.cga}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "cga",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div className="mb-4">
                    <h5>Professional Experience</h5>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                      required
                    />
                  </div>

                  {/* Hobbies Section */}

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Generate Resume
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal2 */}
      {modalIsOpen2 && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="bg-light modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Your Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalIsOpen2(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit2}>
                  {/* Personal Information Section */}
                  <div className="mb-4">
                    <h5>Personal Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Male</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Female</label>
                      </div>
                    </div>

                    {/* address */}
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="3"
                      />
                    </div>
                    {/* Religion */}
                    <div className="mb-4">
                      <h5>Religion</h5>
                      <textarea
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    {/* Professional title */}
                    <div className="mb-2">
                      <h5>Professional Title</h5>
                      <textarea
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="1"
                        required
                      />
                    </div>
                  </div>
                  {/* Skills Section */}
                  <div className="mb-4">
                    <h5>Professional Skills (Max 5)</h5>
                    <div className="row">
                      {formData.skillset.map((skill, index) => (
                        <div className="col-md-6 mb-3" key={index}>
                          <input
                            type="text"
                            placeholder={`Skill ${index + 1}`}
                            value={skill}
                            onChange={(e) =>
                              handleSkillChange(index, e.target.value)
                            }
                            className="form-control"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Education Section */}
                  <div className="mb-4">
                    <h5>Education</h5>

                    {/* High School */}
                    <div className="mb-4">
                      <h6>High School</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">School Name</label>
                          <input
                            type="text"
                            value={formData.education.highSchool.name}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "name",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            Certificate/Degree
                          </label>
                          <input
                            type="text"
                            value={formData.education.highSchool.degree}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "degree",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Year</label>
                          <input
                            type="text"
                            value={formData.education.highSchool.year}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "year",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Grade</label>
                          <input
                            type="text"
                            value={formData.education.highSchool.grade}
                            onChange={(e) =>
                              handleEducationChange(
                                "highSchool",
                                "grade",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* University */}
                    <div className="mb-4">
                      <h6>University</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">University Name</label>
                          <input
                            type="text"
                            value={formData.education.varsity.name}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "name",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Degree</label>
                          <input
                            type="text"
                            value={formData.education.varsity.degree}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "degree",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Passing Year</label>
                          <input
                            type="text"
                            value={formData.education.varsity.passingYear}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "passingYear",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">CGA</label>
                          <input
                            type="text"
                            value={formData.education.varsity.cga}
                            onChange={(e) =>
                              handleEducationChange(
                                "varsity",
                                "cga",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Experience Section */}
                  <div className="mb-4">
                    <h5>Professional Experience</h5>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Generate Resume
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {downloadLink && (
        <div className="downlink-div m-4 alert alert-success mt-4 d-flex justify-content-between align-items-center">
          <div>
            Your CV has been generated!{" "}
            <a href={downloadLink} target="_blank" download>
              Click here to download.
            </a>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setDownloadLink("")}
          />
        </div>
      )}

      {/* resume show div */}
      <div className="m-4 my-4">
        <h1 className="mb-3 mt-4 text-center">Your CV</h1>

        {successMessage ? (
          <div className="alert alert-success alert-dismissible" role="alert">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setSuccessMessage("")}
            />
          </div>
        ) : errorMessage ? (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {errorMessage}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setErrorMessage("")}
            />
          </div>
        ) : null}

        {resumes.length === 0 ? (
          <p className="mt-5 text-center">🚫 No resumes found for you.</p>
        ) : (
          <ul className="list-group">
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <p>
                  Resume <br /> created:{" "}
                  {format(new Date(resume.created_at), "dd-MM-yyyy, HH:mm:ss")}
                </p>
                <a
                  href={`http://127.0.0.1:8000${resume.cv_file}`}
                  target="_blank"
                  className="badge bg-success"
                >
                  Preview
                </a>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="badge bg-danger"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
