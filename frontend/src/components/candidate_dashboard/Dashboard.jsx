/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import Profile from "../profile/Profile";
import "./Dashboard.css";
import Update from "../profile/Update";

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
  };

  return components[activeComponent] || <div>Select a component</div>;
};

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
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

  return (
    <div className="candidate-dash-div container-fluid bg-primary">
      <div className="row">
        {/* Sidebar */}
        <div className="candidate-dash-sidebar-div col-md-2 bg-dark min-vh-100 text-white p-0">
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
                  activeComponent === "Cand_Profile" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("Cand_Profile")}
              >
                Candidate Profile
              </button>

              <button
                className={`btn btn-link text-white text-decoration-none ${
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
              <Link
                to="/candidate/build/resume"
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "resume" ? "active" : ""
                }`}
              >
                🆕 Generate Resume
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="candidate-dash-content-div col-md-10 p-4 bg-white mt-4">
          <br />
          <br />
          <MainContent activeComponent={activeComponent} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
