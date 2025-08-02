import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const firstRefresh = sessionStorage.getItem("firstRefresh");
    if (!firstRefresh) {
      sessionStorage.setItem("firstRefresh", "true");
      window.location.reload();
      return;
    }

    const storedUserData = sessionStorage.getItem("candidateData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setLoading(false);
    } else {
      navigate("/signin");
    }
  }, [navigate]);

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
  const profileImage = `http://localhost:8000${userData.profile_picture}`;
  const resumeLink = `http://localhost:8000${userData.resume}`;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderEducationSection = () => (
    <>
      <div className="col-md-6">
        <div className="info-group">
          <h5 className="info-label">
            <i className="bi bi-book me-2"></i>High School
          </h5>
          <div className="education-details">
            <p>
              <strong>Name:</strong>{" "}
              {userData.high_school_name || "Not specified"}
            </p>
            <p>
              <strong>Degree:</strong>{" "}
              {userData.high_school_degree || "Not specified"}
            </p>
            <p>
              <strong>Year:</strong>{" "}
              {userData.high_school_passing_year || "Not specified"}
            </p>
            <p>
              <strong>Grade:</strong>{" "}
              {userData.high_school_grade || "Not specified"}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="info-group">
          <h5 className="info-label">
            <i className="bi bi-building me-2"></i>University
          </h5>
          <div className="education-details">
            <p>
              <strong>Name:</strong>{" "}
              {userData.university_name || "Not specified"}
            </p>
            <p>
              <strong>Degree:</strong>{" "}
              {userData.university_degree || "Not specified"}
            </p>
            <p>
              <strong>Year:</strong>{" "}
              {userData.university_passing_year || "Not specified"}
            </p>
            <p>
              <strong>Grade:</strong>{" "}
              {userData.university_grade || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderPersonalInfoSection = () => (
    <>
      <div className="col-md-4">
        <div className="info-group">
          <h5 className="info-label">
            <i className="bi bi-calendar me-2"></i>Date of Birth
          </h5>
          <p className="info-value">{formatDate(userData.dob)}</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="info-group">
          <h5 className="info-label">
            <i className="bi bi-gender-ambiguous me-2"></i>Gender
          </h5>
          <p className="info-value">{userData.gender || "Not specified"}</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="info-group">
          <h5 className="info-label">
            <i className="bi bi-heart me-2"></i>Religion
          </h5>
          <p className="info-value">{userData.religion || "Not specified"}</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card profile-card shadow">
              <div className="card-header profile-header text-center py-4">
                <div className="profile-image-container mx-auto">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => {
                      e.target.src = defaultProfilePicture;
                    }}
                  />
                </div>
                <h2 className="mt-4 mb-0 text-dark">{userData.full_name}</h2>
              </div>

              <div className="card-body p-4">
                <h4 className="section-title mb-4">
                  <i className="bi bi-person me-2"></i>Personal Information
                </h4>
                <div className="row g-4 mb-4">
                  {renderPersonalInfoSection()}
                </div>

                <h4 className="section-title mb-4">
                  <i className="bi bi-telephone me-2"></i>Contact Information
                </h4>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="info-group">
                      <h5 className="info-label">
                        <i className="bi bi-envelope-fill me-2"></i>Email
                      </h5>
                      <p className="info-value">{userData.email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <h5 className="info-label">
                        <i className="bi bi-phone-fill me-2"></i>Phone
                      </h5>
                      <p className="info-value">{userData.phone_number}</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="info-group">
                      <h5 className="info-label">
                        <i className="bi bi-geo-alt-fill me-2"></i>Location
                      </h5>
                      <p className="info-value">{userData.location}</p>
                    </div>
                  </div>
                </div>

                <h4 className="section-title mb-4">
                  <i className="bi bi-mortarboard me-2"></i>Education
                </h4>
                <div className="row g-4 mb-4">{renderEducationSection()}</div>

                <h4 className="section-title mb-4">
                  <i className="bi bi-briefcase me-2"></i>Professional
                  Information
                </h4>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="info-group">
                      <h5 className="info-label">
                        <i className="bi bi-tools me-2"></i>Skills
                      </h5>
                      <div className="skills-container">
                        {userData.skills.split(",").map((skill, index) => (
                          <span key={index} className="skill-badge">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <h5 className="info-label">
                        <i className="bi bi-file-earmark-text me-2"></i>Resume
                      </h5>
                      <p className="info-value">
                        {resumeLink ? (
                          <a
                            href={resumeLink}
                            className="btn btn-sm btn-outline-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-download me-1"></i>View Resume
                          </a>
                        ) : (
                          <span className="text-muted">Not available</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="info-group">
                      <h5 className="info-label">
                        <i className="bi bi-card-checklist me-2"></i>Experience
                      </h5>
                      <div className="experience-content">
                        {userData.professional_experience ? (
                          <p>{userData.professional_experience}</p>
                        ) : (
                          <p className="text-muted">No experience added</p>
                        )}
                      </div>
                    </div>
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
