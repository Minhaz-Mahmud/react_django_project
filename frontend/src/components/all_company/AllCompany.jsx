/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import axios from "axios";
import Details from "./Details";
import "./AllCompany.css";
import CompanyMapModal from "../company_maps/CompanyMapModal";

const AllCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companyLocation, setCompanyLocation] = useState(null);
  const [hasSession, setHasSession] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    type: "",
  });

  // Fetch company list
  useEffect(() => {
    fetchCompanies();
    checkSessionData();
  }, []);

  // Filter companies based on search
  useEffect(() => {
    applyFilters();
  }, [filters, companies]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/all/company/list/"
      );
      setCompanies(response.data);
      setFilteredCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load company data.");
      setLoading(false);
    }
  };

  // Check if there's any session data
  const checkSessionData = () => {
    const candidateData = sessionStorage.getItem("candidateData");
    const companyData = sessionStorage.getItem("companyData");
    if (candidateData || companyData) {
      setHasSession(true);
    } else {
      setHasSession(false);
    }
  };

  // Apply filters to the company list
  const applyFilters = () => {
    const filtered = companies.filter((company) => {
      return (
        (filters.location === "" ||
          company.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (filters.type === "" ||
          company.company_type
            .toLowerCase()
            .includes(filters.type.toLowerCase()))
      );
    });
    setFilteredCompanies(filtered);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Show company details modal
  const handleShowDetails = (companyId) => {
    setSelectedCompanyId(companyId);
    setShowDetailsModal(true);
    setShowMapModal(false); // Close map modal if open
  };

  // Show company location map modal
  const handleLocationClick = async (companyId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/company/location/${companyId}/`
      );
      setCompanyLocation(response.data);
      setShowMapModal(true);
      setShowDetailsModal(false); // Close details modal if open
    } catch (error) {
      setError("Failed to fetch location.");
    }
  };

  // Close both modals
  const handleClose = () => {
    setShowDetailsModal(false);
    setShowMapModal(false);
  };

  return (
    <div className="all-company-container">
      <div className="sidebar">
        <h3>Filter Companies</h3>
        <div className="filter-controls">
          <div className="form-group">
            <label className="form-label">Location:</label>
            <select
              name="location"
              className="form-control mb-2"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Khulna">Khulna</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Company Type:</label>
            <select
              name="type"
              className="form-control"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Multinational">Multinational</option>
              <option value="International">International</option>
              <option value="Startup">Startup</option>
              <option value="Small Business">Small Business</option>
            </select>
          </div>
        </div>
      </div>

      <div className="main-content">
        <h1 className="text-center mb-4">Company List</h1>

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading companies...</p>
          </div>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : filteredCompanies.length > 0 ? (
          <div className="company-list">
            {filteredCompanies.map((company) => (
              <div className="company-row" key={company.id}>
                <div className="company-info">
                  <h2>{company.name}</h2>
                  <p>
                    <strong>Location:</strong> {company.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {company.description}
                  </p>
                  {company.website && (
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </p>
                  )}
                  <p>
                    <strong>Type:</strong> {company.company_type}
                  </p>
                </div>
                <div className="company-actions">
                  {/* Conditionally render Details and Location buttons */}
                  {hasSession && (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleShowDetails(company.id)}
                      >
                        Details
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleLocationClick(company.id)}
                      >
                        Location
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No companies match the filter criteria.</p>
        )}

        {/* Company Details Modal */}
        <Details
          companyId={selectedCompanyId}
          showModal={showDetailsModal}
          handleClose={handleClose}
        />

        {/* Company Map Modal */}
        {showMapModal && companyLocation && (
          <CompanyMapModal
            companyLocation={companyLocation}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllCompany;
