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
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;

  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    type: "",
  });

  // scroll button
  const [showUpButton, setShowUpButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowUpButton(true);
      } else {
        setShowUpButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchCompanies();
    checkSessionData();
  }, []);

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

  const checkSessionData = () => {
    const candidateData = sessionStorage.getItem("candidateData");
    const companyData = sessionStorage.getItem("companyData");
    setHasSession(candidateData || companyData ? true : false);
  };

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
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleShowDetails = (companyId) => {
    setSelectedCompanyId(companyId);
    setShowDetailsModal(true);
    setShowMapModal(false);
  };

  const handleLocationClick = async (companyId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/company/location/${companyId}/`
      );
      setCompanyLocation(response.data);
      setShowMapModal(true);
      setShowDetailsModal(false);
    } catch (error) {
      setError("Failed to fetch location.");
    }
  };

  const handleClose = () => {
    setShowDetailsModal(false);
    setShowMapModal(false);
  };

  // Pagination logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCompanies.length / companiesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="all-company-container">
      <div className="hero-section">
        <div className="hero-overlay d-flex flex-column justify-content-center align-items-center">
          <h1>Find the Best Companies for Your Career</h1>
          <p>Browse through top companies and explore career opportunities</p>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="sidebar">
          <h3>Filter Companies</h3>
          <div className="filter-controls">
            <div className="form-group">
              <label>Location:</label>
              <select
                name="location"
                className="form-control"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Khulna">Khulna</option>
              </select>
            </div>
            <div className="form-group">
              <label>Company Type:</label>
              <select
                name="type"
                className="form-control"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Multinational">Multinational</option>
                <option value="Startup">Startup</option>
              </select>
            </div>
          </div>
        </div>

        <div className="main-content">
          <h1 className="text-center mb-4">Explore Companies</h1>

          {loading ? (
            <p className="text-center">Loading companies...</p>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : currentCompanies.length > 0 ? (
            <div className="company-list">
              {currentCompanies.map((company) => (
                <div className="company-row" key={company.id}>
                  <div className="company-info">
                    <h2>{company.name}</h2>
                    <p>
                      <strong>Location:</strong> {company.location}
                    </p>
                    <p>
                      <strong>Type:</strong> {company.company_type}
                    </p>
                  </div>
                  {hasSession && (
                    <div className="company-actions">
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">
              No companies match the filter criteria.
            </p>
          )}

          {/* Pagination controls */}
          <div className="pagination-controls py-5">
            <button
              className="btn btn-danger rounded-1 border border-2 border-black current-model"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span> Page {currentPage} </span>
            <button
              className="btn btn-pri rounded border border-2 border-black current-model"
              onClick={nextPage}
              disabled={
                currentPage >=
                Math.ceil(filteredCompanies.length / companiesPerPage)
              }
            >
              Next
            </button>
          </div>

          <Details
            companyId={selectedCompanyId}
            showModal={showDetailsModal}
            handleClose={handleClose}
          />
          {showMapModal && companyLocation && (
            <CompanyMapModal
              companyLocation={companyLocation}
              handleClose={handleClose}
            />
          )}
        </div>
      </div>
      {showUpButton && (
        <button className="up-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default AllCompany;
