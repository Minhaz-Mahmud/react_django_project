import "./AppliedJobs.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faAddressBook,
  faBriefcase,
  faDollarSign,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get logged in candidate data from session storage
    const loggedInCandidateData = JSON.parse(
      sessionStorage.getItem("candidateData")
    );

    if (!loggedInCandidateData) {
      window.location.href = "/candidate/login";
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
      console.log(data);
      setAppliedJobs(data.applied_jobs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your applied jobs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

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

  return (
    <div className="applied-jobs-container">
      <h2 className="applied-jobs-heading text-dark text-center">
        Applied Jobs
      </h2>

      {appliedJobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>You haven&apos;t applied to any jobs yet.</p>
          <Link to="/jobs" className="browse-jobs-button">
            Browse Jobs <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      ) : (
        <div className="applied-jobs-list">
          {appliedJobs.map((job) => (
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

                <p className="applied-job-time">
                  <FontAwesomeIcon icon={faClock} /> <strong>Hours:</strong>{" "}
                  {job.job_time}
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
      )}
    </div>
  );
}

export default AppliedJobs;
