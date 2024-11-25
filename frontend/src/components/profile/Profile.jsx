import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("candidateData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      window.location.href = "/signin";
    }
  }, []);

  if (!userData) return <div>Loading...</div>;

  const defaultProfilePicture = "profile.jpg"; 
  const profileImage = userData.profile_picture
    ? `http://localhost:8000${userData.profile_picture}`
    : defaultProfilePicture;
  const resumeLink = userData.resume ? `http://localhost:8000${userData.resume}` : null;

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      {/* Profile Picture */}
      <div className="profile-picture" style={{ backgroundImage: `url(${profileImage})` }}></div>

      {/* Profile Details */}
      <div className="profile-details">
        <p><strong>Name:</strong> {userData.full_name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone Number:</strong> {userData.phone_number}</p>
        <p><strong>Location:</strong> {userData.location}</p>
        <p><strong>Skills:</strong> {userData.skills}</p>

        {/* Resume */}
        <p><strong>Resume:</strong> 
          {resumeLink ? (
            <a href={resumeLink} target="_blank" rel="noopener noreferrer">View Resume</a>
          ) : (
            "N/A"
          )}
        </p>

        {/* Profile Picture */}
        <p><strong>Profile Picture:</strong></p>
        {userData.profile_picture ? (
          <img 
            src={profileImage} 
            alt={`${userData.full_name}'s Profile`} 
            className="profile-picture"
          />
        ) : (
          <p>No Profile Picture Available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
