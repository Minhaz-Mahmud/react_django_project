/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

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
    colors: <h2>Colors</h2>,
    typography: <h2>Typography</h2>,
    base: <h2>Base</h2>,
    buttons: <h2>Buttons</h2>,
    editors: <h2>Editors</h2>,
    forms: <h2>Forms</h2>,
    googleMaps: <h2>Google Maps</h2>,
    icons: <h2>Icons</h2>,
    notifications: <h2>Notifications</h2>,
    plugins: <h2>Plugins</h2>,
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
            <h5 className="text-white">COREUI</h5>
          </div>

          <div className="nav flex-column">
            <div className="p-3 border-bottom">
              <h6 className="text-muted">THEME</h6>
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("dashboard")}
              >
                Dashboard
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "colors" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("colors")}
              >
                Colors
              </button>
            </div>
            <div className="p-3">
              <h6 className="text-light">COMPONENTS</h6>
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "base" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("base")}
              >
                Base
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "buttons" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("buttons")}
              >
                Buttons
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "editors" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("editors")}
              >
                Editors
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "forms" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("forms")}
              >
                Forms
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "googleMaps" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("googleMaps")}
              >
                Google Maps
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "icons" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("icons")}
              >
                Icons
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "notifications" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("notifications")}
              >
                Notifications
              </button>
              <br />
              <button
                className={`btn btn-link text-white text-decoration-none ${
                  activeComponent === "plugins" ? "active" : ""
                }`}
                onClick={() => setActiveComponent("plugins")}
              >
                Plugins
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
