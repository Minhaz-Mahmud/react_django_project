/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import CompanyProfile from "../profile/company_profile";
import JobPost from "../dashboard_components/job_post/JobPost";
import PostedJobs from "../dashboard_components/posted_jobs/PostedJobs";
import "./company_dashboard.css";

// Component for the summary cards at the top
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
        <h2>Dashboard</h2>
        <div className="row">
          <div className="col-md-3">
            <SummaryCard
              title="Members online"
              value="9,823"
              bgColor="bg-primary"
            />
          </div>
          <div className="col-md-3">
            <SummaryCard
              title="Members online"
              value="9,823"
              bgColor="bg-info"
            />
          </div>
          <div className="col-md-3">
            <SummaryCard
              title="Members online"
              value="9,823"
              bgColor="bg-warning"
            />
          </div>
          <div className="col-md-3">
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
            {/* Chart would go here */}
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
    job_responses: <h2>job_responses</h2>,
    active_recruitments: <h2>active_recruitments</h2>,
    googleMapsLocation: <h2>Google Maps</h2>,
  };

  return components[activeComponent] || <div>Select a component</div>;
};

const CompanyDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
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

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark min-vh-100 text-white p-0">
          <div className="p-3 border-bottom">
            {/* take name from the companyData sessionStorage and display it */}
            <h5 className="text-white">COREUI</h5>
          </div>

          <div className="nav flex-column">
            <div className="p-3 border-bottom">
              <h6 className="text">MAIN</h6>
              {/* dashboard */}
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("dashboard")}
              >
                Dashboard
              </button>
              <br />
              {/* Comp_Profile */}
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "Comp_Profile" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("Comp_Profile")}
              >
                Company Profile
              </button>
            </div>

            <div className="p-3">
              <h6 className="text-light">OTHERS</h6>
              {/* Post jobs */}
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "base" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("post_Job")}
              >
                Post Jobs
              </button>
              <br />
              {/* Posted jobs */}
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "base" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("posted_jobs")}
              >
                Posted Jobs
              </button>
              <br />
              {/* see responses */}
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "buttons" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("job_responses")}
              >
                Job Responses
              </button>
              <br />
              {/* active recruitment */}
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "editors" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("active_recruitments")}
              >
                Activate Recruitment
              </button>
              <br />
              {/* googleMapsLocation */}
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "googleMaps" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("googleMapsLocation")}
              >
                Google Map Location
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-10 p-4">
          <MainContent activeComponent={activeComponent} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
