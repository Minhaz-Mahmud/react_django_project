
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../posted_jobs/PostedJobs.css"; // Reusing styles from PostedJobs

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/job-posts/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching job details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="jobs-loading-wrapper">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="loading-text">Loading job details...</p>
      </div>
    );
  }

  if (!job) return <p className="text-center mt-5">Job not found.</p>;

  return (
    
    <div className="posted-jobs-container">
         <br /><br /><br /><br /><br /><br />
      <div className="job-card p-4 border rounded shadow-sm">
        <div className="job-card-header mb-3">
           
          <h2 className="job-title">{job.title}</h2>
        </div>

        <div className="job-card-body">
          <div className="job-info-grid">
            <div className="job-details">
              <div className="job-detail-item">
                <span className="detail-label">Company:</span>
                <span className="detail-value">{job.company}</span>
              </div>
              <div className="job-detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{job.job_location}</span>
              </div>
              <div className="job-detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{job.job_type}</span>
              </div>
              <div className="job-detail-item">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{job.job_time}</span>
              </div>
              <div className="job-detail-item">
                <span className="detail-label">Salary:</span>
                <span className="detail-value">{job.salary_range}</span>
              </div>
              <div className="job-detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  {job.active_recruiting ? "Active" : "Paused"}
                </span>
              </div>
              <div className="job-detail-item">
                <span className="detail-label">Posted:</span>
                <span className="detail-value">
                  {new Date(job.posted_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="job-description">
              <p className="text-muted description-text">{job.description}</p>
            </div>
          </div>

          <div className="job-tags mt-3">
            {job.tags.split(",").map((tag, index) => (
              <span key={index} className="badge bg-secondary me-2">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const JobDetails = () => {
//   const { id } = useParams();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`http://127.0.0.1:8000/job-posts/${id}/`)
//       .then((res) => res.json())
//       .then((data) => {
//         setJob(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching job details:", err);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!job) return <p>Job not found.</p>;

//   return (
//     <div className="job-details">
//         <br /><br /><br /><br />
//       <h1>{job.title}</h1>
//       <p><strong>Company:</strong> {job.company}</p>
//       <p><strong>Location:</strong> {job.job_location}</p>
//       <p><strong>Type:</strong> {job.job_type}</p>
//       <p><strong>Time:</strong> {job.job_time}</p>
//       <p><strong>Salary:</strong> {job.salary_range}</p>
//       <p><strong>Tags:</strong> {job.tags}</p>
//       <p><strong>Description:</strong> {job.description}</p>
//       <p><strong>Posted At:</strong> {new Date(job.posted_at).toLocaleString()}</p>
//       <p><strong>Status:</strong> {job.active_recruiting ? "Active" : "Paused"}</p>
//     </div>
//   );
// };

// export default JobDetails;
