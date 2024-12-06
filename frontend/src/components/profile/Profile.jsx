import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
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
      setUserData(JSON.parse(storedUserData));
    } else {
      // Redirect to the sign-in page if no user data exists
      navigate("/signin");
    }
  }, [navigate]);

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
      <div className="profile-details">
        <br />
        <div
          className="profile-picture"
          style={{ backgroundImage: `url(${profileImage})` }}
        ></div>

        <p>
          <strong>Name:</strong>{" "}
          <span className="fetched-data">{userData.full_name}</span>
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <span className="fetched-data">{userData.email}</span>
        </p>
        <p>
          <strong>Phone Number:</strong>{" "}
          <span className="fetched-data">{userData.phone_number}</span>
        </p>
        <p>
          <strong>Location:</strong>{" "}
          <span className="fetched-data">{userData.location}</span>
        </p>
        <p>
          <strong>Skills:</strong>{" "}
          <span className="fetched-data">{userData.skills}</span>
        </p>

        <p>
          <strong>Resume:</strong>{" "}
          {resumeLink ? (
            <a href={resumeLink} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          ) : (
            "N/A"
          )}
        </p>
      </div>
    </div>
  );
};

export default Profile;
