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

  const profileImage = userData.profile_picture
    ? `http://localhost:8000${userData.profile_picture}`
    : defaultProfilePicture;
  const resumeLink = userData.resume
    ? `http://localhost:8000${userData.resume}`
    : null;

  return (
    <div className="profile-page">
      <div className="profile-page-div row justify-content-center">
        <div className="col-lg-8 col-md-10 bg-light profile-container shadow p-4">
          <div className="profile-header text-center text-white py-3">
            <div className="profile-image-container">
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
          <div className="profile-body p-4">
            <div className="row g-4">
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
              <div className="col-md-6">
                <div className="info-group">
                  <h5 className="info-label">
                    <i className="bi bi-geo-alt-fill me-2"></i>Address
                  </h5>
                  <p className="info-value">{userData.location}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-group">
                  <h5 className="info-label">
                    <i className="bi bi-file-earmark-text-fill me-2"></i>
                    Resume
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
