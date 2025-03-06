import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./company_profile.css";

const CompanyProfile = () => {
  const [formData, setFormData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [companyType, setCompanyType] = useState("");

  const editableFields = [
    "name",
    "phone_number",
    "ceo_phone",
    "location",
    "description",
    "website",
  ];

  useEffect(() => {
    const storedCompanyData = sessionStorage.getItem("companyData");
    if (storedCompanyData) {
      const parsedData = JSON.parse(storedCompanyData);
      setCompanyData(parsedData);
      setFormData(parsedData);
      setCompanyType(parsedData.company_type);
    } else {
      window.location.href = "/company-signin";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData, company_type: companyType };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/company/update-profile/",
        updatedData
      );
      setSuccessMessage(response.data.message);
      setCompanyData(response.data.company);
      setIsEditing(false);
      sessionStorage.setItem(
        "companyData",
        JSON.stringify(response.data.company)
      );
      toast.success("Company profile updated successfully");
    } catch (error) {
      console.error("Error updating company profile", error);
      toast.error("An error occurred: " + error.message);
      setErrorMessage(
        error.response?.data?.error || "Failed to update company profile."
      );
    }
  };

  return (
    <div className="cp-container">
      <div className="cp-header">
        <h2>Company Profile</h2>
      </div>

      <ToastContainer position="top-center" autoClose={1500} />

      {successMessage && (
        <div className="alert alert-success alert-dismissible" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setSuccessMessage("")}
          />
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setErrorMessage("")}
          />
        </div>
      )}

      <div className="cp-profile-section">
        {!isEditing ? (
          <div>
            {editableFields.map((field) => (
              <div key={field} className="cp-profile-item">
                <span className="cp-profile-label">
                  {field.replace("_", " ").toUpperCase()}
                </span>
                <span className="cp-profile-value">
                  {companyData[field] || "N/A"}
                </span>
              </div>
            ))}
            <div className="cp-profile-item">
              <span className="cp-profile-label">Company Type</span>
              <span className="cp-profile-value">
                {companyData.company_type || "N/A"}
              </span>
            </div>

            <button
              className="cp-btn-update w-100 mt-3"
              onClick={() => setIsEditing(true)}
            >
              Update Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {editableFields.map((field) => (
              <div key={field} className="cp-form-group">
                <label htmlFor={field} className="cp-form-label">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  className="form-control cp-form-control"
                  value={formData[field] || ""}
                  onChange={handleChange}
                  required={field === "email" || field === "name"}
                />
              </div>
            ))}

            <div className="cp-form-group">
              <label className="cp-form-label">Company Type</label>
              <select
                className="form-control cp-form-control cp-select"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                required
              >
                <option value="Multinational">Multinational</option>
                <option value="International">International</option>
                <option value="Startup">Startup</option>
                <option value="Small Business">Small Business</option>
              </select>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="cp-btn-save flex-grow-1 me-2">
                Save Changes
              </button>
              <button
                type="button"
                className="cp-btn-cancel flex-grow-1"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(companyData);
                  setCompanyType(companyData.company_type);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
