import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./PostedJobs.css";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));

    if (!companyData || !companyData.email) {
      toast.error("Please log in to view your jobs.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/company/posted-jobs/",
        {
          params: { company_email: companyData.email },
        }
      );
      setJobs(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to fetch jobs.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const companyData = JSON.parse(sessionStorage.getItem("companyData"));
    if (!companyData || !companyData.email) {
      toast.error("You must be logged in to delete a job.");
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/company/delete-job/${jobId}/`,
        {
          data: { company_email: companyData.email },
        }
      );
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete the job.";
      toast.error(errorMessage);
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="posted-jobs-container">
      <ToastContainer position="top-center" autoClose={2000} />

      {loading ? (
        <div className="jobs-loading-wrapper">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="loading-text">Loading jobs...</p>
        </div>
      ) : (
        <div className="posted-jobs-wrapper">
          <h2 className="posted-jobs-title text-light pb-2 border-bottom border-dark">
            Your Posted Jobs
          </h2>
          {jobs.length === 0 ? (
            <div className="no-jobs-container">
              <p className="no-jobs-text">No jobs posted yet.</p>
            </div>
          ) : (
            <div>
              <div className="jobs-grid row g-4">
                {currentJobs.map((job) => (
                  <div key={job.id} className="col-12 col-md-6 col-lg-4">
                    <div className="job-card-container">
                      <div className="job-card p-4 border rounded shadow-sm">
                        <div className="job-card-header mb-3">
                          <h5 className="job-title">{job.title}</h5>
                        </div>

                        <div className="job-card-body">
                          <p className="job-id text-muted">
                            Job id: {job.id}
                          </p>
                          <div className="job-details">
                            <div className="job-detail-item">
                              <span className="detail-label">Location:</span>
                              <span className="detail-value">
                                {job.job_location}
                              </span>
                            </div>
                            <div className="job-detail-item">
                              <span className="detail-label">Type:</span>
                              <span className="detail-value">
                                {job.job_type}
                              </span>
                            </div>
                            <div className="job-detail-item">
                              <span className="detail-label">Salary:</span>
                              <span className="detail-value">
                                {job.salary_range}
                              </span>
                            </div>
                            <div className="job-detail-item">
                              <span className="detail-label">Time:</span>
                              <span className="detail-value">
                                {job.job_time}
                              </span>
                            </div>
                          </div>
                          <div className="job-description mt-3">
                            <p className="text-muted">{job.description}</p>
                          </div>
                          <div className="job-tags mt-2">
                            <span className="badge bg-secondary me-2">
                              {job.tags}
                            </span>
                          </div>
                        </div>
                        <div className="job-card-footer mt-3">
                          <button
                            className="btn btn-danger job-delete-btn w-100"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <i className="bi bi-trash me-2"></i>Delete Job
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pagination mt-4">
                {Array.from(
                  { length: Math.ceil(jobs.length / jobsPerPage) },
                  (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`btn btn-primary me-2 ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
