/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CompanyProfile from "../company_profile/company_profile";
import JobPost from "../dashboard_components/job_post/JobPost";
import PostedJobs from "../dashboard_components/posted_jobs/PostedJobs";
import "./company_dashboard.css";
import CompanyMap from "../company_maps/CompanyMapUpdate";
import JobApplications from "../job_applications/JobApplications";
import ActiveRecruit from "../dashboard_components/active_recruit/ActiveRecruit";

// SummaryCard component
const SummaryCard = ({ title, value, bgColor, icon, data, lineColor }) => (
  <div className={`card ${bgColor} text-white mb-4 shadow-lg`}>
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="card-title mb-1">{title}</h6>
          <h2 className="mb-0 font-weight-bold">{value}</h2>
        </div>
        <div className="text-white-50">{icon}</div>
      </div>
      <div style={{ height: "60px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const MainContent = ({ activeComponent, counts }) => {
  // Generate trend data for each card
  const generateTrendData = (baseValue, trend) => {
    return Array(6)
      .fill()
      .map((_, i) => ({
        name: i,
        value: Math.max(0, Math.round(baseValue * trend[i])),
      }));
  };

  // Trend data for each summary card
  const jobPostsData = generateTrendData(
    counts.job_posts_count,
    [0.7, 0.75, 0.8, 0.85, 0.95, 1.0]
  );
  const applicationsData = generateTrendData(
    counts.applications_count,
    [0.5, 0.6, 0.75, 0.9, 0.95, 1.0]
  );
  const appliesData = generateTrendData(
    counts.apply_count,
    [0.6, 0.65, 0.7, 0.8, 0.9, 1.0]
  );

  // Data for pie chart
  const pieData = [
    { name: "Job Posts", value: counts.job_posts_count, fill: "#1a237e" },
    { name: "Mailed", value: counts.applications_count, fill: "#006064" },
    { name: "Applications", value: counts.apply_count, fill: "#e65100" },
  ];

  const components = {
    dashboard: (
      <div className="dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-light">Recruitment Performance</h2>
        </div>

        {/* Summary Cards Row with Embedded Charts */}
        <div className="row">
          <div className="col-md-4 mb-4">
            <SummaryCard
              title="Job Posts"
              value={counts.job_posts_count}
              bgColor="bg-dark"
              lineColor="#8c9eff"
              data={jobPostsData}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              }
            />
          </div>

          <div className="col-md-4 mb-4">
            <SummaryCard
              title="Applications"
              value={counts.apply_count}
              bgColor="bg-dark"
              lineColor="#ffcc80"
              data={appliesData}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              }
            />
          </div>

          <div className="col-md-4 mb-4">
            <SummaryCard
              title="Mailed"
              value={counts.applications_count}
              bgColor="bg-dark"
              lineColor="#80deea"
              data={applicationsData}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                </svg>
              }
            />
          </div>
        </div>

        {/* Main Performance Chart */}
        <div className="row">
          {/* Recruitment Funnel Chart */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-lg bg-white">
              <div className="card-header bg-dark text-white">
                <h5 className="card-title mb-0">Recruitment Funnel</h5>
              </div>
              <div className="card-body d-flex justify-content-center align-items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#343a40",
                        color: "#fff",
                        borderRadius: "5px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-lg bg-white">
              <div className="card-header bg-dark text-white">
                <h5 className="card-title mb-0">Summary Bar Chart</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={pieData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#343a40",
                        color: "#fff",
                        borderRadius: "5px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-lg bg-white">
              <div className="card-header bg-dark text-white">
                <h5 className="card-title mb-0">Trend Summary</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={pieData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#343a40",
                        color: "#fff",
                        borderRadius: "5px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
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
  const [counts, setCounts] = useState({
    job_posts_count: 0,
    applications_count: 0,
    apply_count: 0,
  });
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

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const companyData = JSON.parse(sessionStorage.getItem("companyData"));

      if (!companyData || !companyData.id) {
        console.error("Company data not found in sessionStorage.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/sum/count/company/dashboard?company_id=${companyData.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

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
          <MainContent activeComponent={activeComponent} counts={counts} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
