import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        const errorMessage =
          err.response?.data?.error || "Failed to fetch jobs.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // const handleDeleteJob = async (jobId) => {
  //   if (!window.confirm("Are you sure you want to delete this job?")) return;

  //   try {
  //     await axios.delete(
  //       `http://127.0.0.1:8000/api/company/delete-job/${jobId}/`
  //     );
  //     setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  //     toast.success("Job deleted successfully!");
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.error || "Failed to delete the job.";
  //     toast.error(errorMessage);
  //   }
  // };

  return (
    <div className="container my-4">
      <ToastContainer position="top-center" autoClose={2000} />
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div>
          <h2 className="text-center mb-4">Your Posted Jobs</h2>
          {jobs.length === 0 ? (
            <p>No jobs posted yet.</p>
          ) : (
            <div className="row">
              {jobs.map((job) => (
                <div key={job.id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body bg bg-dark">
                      <p className="card-text">
                        <strong>Job Title:</strong> {job.title}
                      </p>
                      <p className="card-text">
                        <strong>Tags:</strong> {job.tags}
                      </p>
                      <p className="card-text">
                        <strong>Type:</strong> {job.job_type}
                      </p>
                      <p className="card-text">
                        <strong>Salary:</strong> {job.salary_range}
                      </p>
                      <p className="card-text">
                        <strong>Time:</strong> {job.job_time}
                      </p>
                      <p className="card-text">
                        <strong>Description:</strong> {job.description}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-center">
                      <button
                        className="btn btn-danger btn-sm"
                        // onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
