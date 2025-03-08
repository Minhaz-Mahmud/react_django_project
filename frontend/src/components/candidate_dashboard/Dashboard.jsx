/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import Profile from "../profile/Profile";
import "./Dashboard.css";
import Update from "../profile/Update";
import AppliedJobs from "../candidate_dashboard/cand_applied_jobs/AppliedJobs";
import ResumeBuilder from "../resume/ResumeBuilder";

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
    Cand_Profile: (
      <div>
        <Profile />
      </div>
    ),
    Update_Profile: (
      <div>
        <Update />
      </div>
    ),
    Cand_Applied_jobs: (
      <div>
        <AppliedJobs />
      </div>
    ),
    Resume_Builder: (
      <div>
        <ResumeBuilder />
      </div>
    ),
  };

  return components[activeComponent] || <div>Select a component</div>;
};

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const storedUserData = sessionStorage.getItem("candidateData");
  let firstRefresh = sessionStorage.getItem("firstRefresh");

  useEffect(() => {
    // Always reload the page upon visiting the dashboard
    if (!firstRefresh) {
      sessionStorage.setItem("firstRefresh", "false");
      window.location.reload(); // Trigger page reload
    } else if (!storedUserData) {
      navigate("/signin"); // Redirect if user data is not available
    }
  }, [navigate, storedUserData, firstRefresh]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="candidate-dash-div container-fluid">
      {/* Mobile Menu Toggle */}
      {!isSidebarOpen ? (
        <button
          className="candidate-sidebar-mobile-toggle d-md-none"
          onClick={toggleSidebar}
        >
          ☰ Menu
        </button>
      ) : (
        <button
          className="candidate-sidebar-mobile-close d-md-none"
          onClick={toggleSidebar}
        >
          ✕ Close
        </button>
      )}

      <div className="row">
        {/* Sidebar */}
        <div
          className={`candidate-dash-sidebar-div col-md-2 bg-dark min-vh-100 text-white p-0 
            ${isSidebarOpen ? "mobile-sidebar-open" : "mobile-sidebar-closed"}`}
        >
          <div className="p-2 border-bottom"></div>

          <div className="nav flex-column">
            <div className="p-3 border-bottom">
              <h6 className="text">MAIN</h6>
              {/* dashboard */}
              <button
                className={`nav-button ${
                  activeComponent === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("dashboard")}
              >
                Dashboard
              </button>

              {/* Comp_Profile */}
              <button
                className={`nav-button ${
                  activeComponent === "Cand_Profile" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("Cand_Profile")}
              >
                Candidate Profile
              </button>

              {/* Update_Profile */}
              <button
                className={`nav-button ${
                  activeComponent === "Update_Profile" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("Update_Profile")}
              >
                Update Profile
              </button>
            </div>

            <div className="p-3">
              <h6 className="text-light">OTHERS</h6>
              {/* generate resume */}
              <button
                className={`nav-button ${
                  activeComponent === "Resume_Builder" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("Resume_Builder")}
              >
                Generate Resume 🆕
              </button>

              {/* Cand_Applied_jobs */}
              <button
                className={`nav-button ${
                  activeComponent === "Cand_Applied_jobs" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("Cand_Applied_jobs")}
              >
                Applied Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="candidate-dash-content-div col-md-10 p-4 mt-4">
          <MainContent activeComponent={activeComponent} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
