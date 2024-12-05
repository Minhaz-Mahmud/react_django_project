/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./company_profile.css";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const storedCompanyData = sessionStorage.getItem("companyData");
    if (storedCompanyData) {
      const parsedData = JSON.parse(storedCompanyData);
      setCompanyData(parsedData);
      setFormData(parsedData);
    } else {
      window.location.href = "/company-signin";
    }
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/company/profile-update/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update session storage with new company data
        sessionStorage.setItem("companyData", JSON.stringify(data.company));

        // Update local state
        setCompanyData(data.company);
        setIsEditing(false);

        // Optional: Show success message
        alert("Profile updated successfully");
      } else {
        // Handle errors
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!companyData) return <div className="text-center mt-5">Loading...</div>;

  // Fields to display/edit, excluding password and id
  const editableFields = [
    "name",
    "email",
    "phone_number",
    "ceo_phone",
    "location",
    "description",
    "website",
    "company_type",
  ];

  return (
    <div className="container profile-div-class">
      <h1 className="text-center mb-4">Your Company Profile</h1>
      <div className="profile-section p-3">
        {isEditing ? (
          <form>
            {editableFields.map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label">
                  {key.replace(/_/g, " ").toUpperCase()}:
                </label>
                {key === "company_type" ? (
                  <select
                    className="form-control"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="Multinational">Multinational</option>
                    <option value="International">International</option>
                    <option value="Startup">Startup</option>
                    <option value="Small Business">Small Business</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {editableFields.map((key) => (
              <p key={key} className="profile-item">
                <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                {companyData[key] || "Not available"}
              </p>
            ))}
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary" onClick={handleEdit}>
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
