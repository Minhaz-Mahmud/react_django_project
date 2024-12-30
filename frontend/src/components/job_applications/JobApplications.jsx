/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ApplicationFeed = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const companyData = sessionStorage.getItem("companyData");
    if (companyData) {
      const parsedCompanyData = JSON.parse(companyData);
      setCompanyId(parsedCompanyData.id);
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchApplications(currentPage, companyId);
    }
  }, [currentPage, companyId]);

  const fetchApplications = async (page, companyId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications/${companyId}/?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch applications.");
      }
      const data = await response.json();
      setApplications(data.results || []);
      setHasNextPage(!!data.next);
      setHasPreviousPage(!!data.previous);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications_del/${applicationId}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete application.");
      }
      setApplications(applications.filter((app) => app.id !== applicationId));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const viewCandidateDetails = (candidateId) => {
    navigate(`/candidate/apply/details/${candidateId}`);
  };

  return (
    <div className="application-feed-container">
      <br />
      <br />
      <br />
      <br />
      <h4>Applications for Company ID: {companyId}</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <ul>
              {applications.map((app) => (
                <li key={app.id}>
                  <strong>{app.candidate__full_name}</strong> applied for{" "}
                  <em>{app.job_title}</em> (Job ID: {app.job_id}) on{" "}
                  {new Date(app.time).toLocaleDateString()}{" "}
                  <h1>{app.candidate_id}</h1>
                  <button
                    onClick={() => viewCandidateDetails(app.candidate_id)}
                    style={{ marginLeft: "10px" }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    style={{ marginLeft: "10px", background: "red" }}
                  >
                    Delete
                  </button>
                  <button style={{ marginLeft: "10px", background: "green" }}>
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="pagination">
            {hasPreviousPage && (
              <button onClick={handlePreviousPage}>Previous</button>
            )}
            <span>Page {currentPage}</span>
            {hasNextPage && <button onClick={handleNextPage}>Next</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationFeed;
