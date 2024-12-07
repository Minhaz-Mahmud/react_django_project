/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
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
    "email",
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
      setCompanyType(parsedData.company_type); // Set the company type for select dropdown
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
    <div className="container mt-5">
      <h2 className="text-center mb-4">Company Profile</h2>

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

      <ToastContainer position="top-center" autoClose={1500} />

      {!isEditing ? (
        <div>
          <ul className="list-group mb-4">
            {editableFields.map((field) => (
              <li key={field} className="list-group-item">
                <strong>{field.replace("_", " ").toUpperCase()}: </strong>
                {companyData[field] || "N/A"}
              </li>
            ))}
            <li className="list-group-item">
              <strong>Company Type: </strong>
              {companyData.company_type || "N/A"}
            </li>
          </ul>
          <button
            className="btn btn-primary w-100"
            onClick={() => setIsEditing(true)}
          >
            Update Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {editableFields.map((field) => (
            <div key={field} className="form-group mb-3">
              <label htmlFor={field} className="form-label">
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                className="form-control"
                value={formData[field] || ""}
                onChange={handleChange}
                required={field === "email" || field === "name"}
              />
            </div>
          ))}

          <div className="form-group mb-3">
            <label className="form-label">Company Type:</label>
            <select
              className="form-control"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              required
            >
              <option className="text-dark" value="Multinational">
                Multinational
              </option>
              <option className="text-dark" value="International">
                International
              </option>
              <option className="text-dark" value="Startup">
                Startup
              </option>
              <option className="text-dark" value="Small Business">
                Small Business
              </option>
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setFormData(companyData); // Reset form data
                setCompanyType(companyData.company_type); // Reset company type
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyProfile;
