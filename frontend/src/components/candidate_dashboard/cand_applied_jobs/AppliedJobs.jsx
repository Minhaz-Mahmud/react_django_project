import "./AppliedJobs.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faAddressBook,
  faBriefcase,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Get logged in candidate data from session storage
    const loggedInCandidateData = JSON.parse(
      sessionStorage.getItem("candidateData")
    );

    if (!loggedInCandidateData) {
      window.location.href = "/signin";
    } else {
      fetchAppliedJobs(loggedInCandidateData.id);
    }
  }, []);

  const fetchAppliedJobs = async (candidateId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/candidate/applied-jobs/${candidateId}/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applied jobs");
      }

      const data = await response.json();
      setAppliedJobs(data.applied_jobs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Application Submitted":
        return "status-submitted";
      case "Under Review":
        return "status-under-review";
      case "Interview Scheduled":
        return "status-interview-scheduled";
      case "Shortlisted":
        return "status-shortlisted";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = appliedJobs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(appliedJobs.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="loading text-center text-light fs-4 fw-bold my-5 py-5 mt-5 pt-5 mb-5 pb-5">
        Loading your applied jobs...
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="applied-jobs-container">
      <h2 className="applied-jobs-heading text-dark text-center">
        Applied Jobs
      </h2>

      {appliedJobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>You haven&apos;t applied to any jobs yet.</p>
          <Link to="/job-feed" className="browse-jobs-button">
            Browse Jobs <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      ) : (
        <>
          <div className="applied-jobs-list">
            {currentJobs.map((job) => (
              <div key={job.apply_id} className="applied-job-item">
                <h3 className="applied-job-title">{job.job_title}</h3>
                <p className="applied-job-company">{job.company_name}</p>

                <div className="job-details-grid">
                  <p className="applied-job-location">
                    <FontAwesomeIcon icon={faAddressBook} />{" "}
                    <strong className="text-dark">Location:</strong>{" "}
                    {job.job_location || job.company_location}
                  </p>

                  <p className="applied-job-type">
                    <FontAwesomeIcon icon={faBriefcase} />{" "}
                    <strong>Job Type:</strong> {job.job_type}
                  </p>

                  <p className="applied-job-salary">
                    <FontAwesomeIcon icon={faDollarSign} />{" "}
                    <strong>Salary:</strong> {job.salary_range}
                  </p>
                </div>

                <p
                  className={`applied-job-status ${getStatusClass(
                    job.application_response
                  )}`}
                >
                  <strong className="text-dark">Status:</strong>{" "}
                  {job.application_response || "Application Submitted"}
                </p>
                <div className="update-instructions">
                  <div className="alert alert-info">
                    <small>An &quot;Email&quot; will reach you soon.</small>
                  </div>
                </div>

                <p className="applied-job-date">
                  <strong>Applied on:</strong>{" "}
                  {new Date(job.applied_time).toLocaleDateString()}
                </p>
                <div className="job-actions">
                  <Link
                    to={`/applied-job-details/${job.job_id}/${job.company_id}`}
                    className="applied-job-details-button"
                  >
                    View Job Details <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AppliedJobs;
