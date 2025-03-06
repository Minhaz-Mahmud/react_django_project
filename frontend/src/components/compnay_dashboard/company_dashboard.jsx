/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyProfile from "../company_profile/company_profile";
import JobPost from "../dashboard_components/job_post/JobPost";
import PostedJobs from "../dashboard_components/posted_jobs/PostedJobs";
import "./company_dashboard.css";
import CompanyMap from "../company_maps/CompanyMapUpdate";
import JobApplications from "../job_applications/JobApplications";
import ActiveRecruit from "../dashboard_components/active_recruit/ActiveRecruit";

const SummaryCard = ({ title, value, bgColor }) => (
  <div className={`card ${bgColor} text-white mb-4`}>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <h2>{value}</h2>
    </div>
  </div>
);

// Component for the main content area
const MainContent = ({ activeComponent }) => {
  const components = {
    dashboard: (
      <div>
        <h2 className="text-light">Dashboard</h2>
        <div className="row">
          <div className="col-6 col-md-3">
            <SummaryCard
              title="Members online"
              value="9,823"
              bgColor="bg-primary"
            />
          </div>
          <div className="col-6 col-md-3">
            <SummaryCard
              title="Members online"
              value="9,823"
              bgColor="bg-info"
            />
          </div>
          <div className="col-6 col-md-3">
            <SummaryCard
              title="Members online"
              value="9,823"
              bgColor="bg-warning"
            />
          </div>
          <div className="col-6 col-md-3">
            <SummaryCard
              title="Members online"
              value="9,823"
              bgColor="bg-danger"
            />
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-body">
            <h3>Traffic</h3>
            <p className="text-muted">November 2017</p>
            <div className="text-center p-5 text-muted">Chart Placeholder</div>
          </div>
        </div>
      </div>
    ),
    Comp_Profile: (
      <div>
        <CompanyProfile />
      </div>
    ),
    post_Job: (
      <div>
        <JobPost />
      </div>
    ),
    posted_jobs: (
      <div>
        <PostedJobs />
      </div>
    ),
    applications: (
      <div>
        <JobApplications />
      </div>
    ),
    active_recruitments: (
      <div>
        <ActiveRecruit />
      </div>
    ),
    googleMapsLocation: (
      <div>
        <CompanyMap />
      </div>
    ),
  };

  return components[activeComponent] || <div>Select a component</div>;
};

const CompanyDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const companyData = sessionStorage.getItem("companyData");
  let firstRefresh = sessionStorage.getItem("firstRefresh");

  useEffect(() => {
    if (firstRefresh === null) {
      sessionStorage.setItem("firstRefresh", "false");
      window.location.reload();
      sessionStorage.setItem("firstRefresh", "true");
    } else if (!companyData) navigate("/company-signin");
  }, [navigate]);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="company-dash-div container-fluid">
      {/* Mobile Menu Toggle */}
      {!isSidebarOpen ? (
        <button
          className="company-sidebar-mobile-toggle d-md-none"
          onClick={toggleSidebar}
        >
          ☰ Menu
        </button>
      ) : (
        <button
          className="company-sidebar-mobile-close d-md-none"
          onClick={toggleSidebar}
        >
          ✕ Close
        </button>
      )}

      <div className="row">
        {/* Sidebar */}
        <div
          className={`company-dash-side-bar-div col-md-2 bg-dark text-white p-0 
            ${isSidebarOpen ? "mobile-sidebar-open" : "mobile-sidebar-closed"}`}
        >
          <div className="nav flex-column">
            <div className="p-3 border-bottom">
              <h6 className="text">MAIN</h6>
              <button
                className={`nav-button ${
                  activeComponent === "dashboard" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("dashboard")}
              >
                Dashboard
              </button>
              <br />
              <button
                className={`nav-button ${
                  activeComponent === "Comp_Profile" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("Comp_Profile")}
              >
                Company Profile
              </button>
            </div>

            <div className="p-3">
              <h6 className="text-light">OTHERS</h6>
              <button
                className={`nav-button ${
                  activeComponent === "post_Job" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("post_Job")}
              >
                Post Jobs
              </button>
              <br />
              <button
                className={`nav-button ${
                  activeComponent === "posted_jobs" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("posted_jobs")}
              >
                Posted Jobs
              </button>
              <br />
              <button
                className={`nav-button ${
                  activeComponent === "applications" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("applications")}
              >
                Job Applications
              </button>
              <br />
              <button
                className={`nav-button ${
                  activeComponent === "active_recruitments" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("active_recruitments")}
              >
                Activate Recruitment
              </button>
              <br />
              <button
                className={`nav-button ${
                  activeComponent === "googleMapsLocation" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("googleMapsLocation")}
              >
                Google Map Location
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="company-dash-content-div col-12 col-md-10 p-4">
          <MainContent activeComponent={activeComponent} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
