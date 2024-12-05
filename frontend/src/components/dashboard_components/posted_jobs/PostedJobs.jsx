// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./PostedJobs.css";

// const PostedJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       const companyData = JSON.parse(sessionStorage.getItem("companyData"));

//       if (!companyData || !companyData.email) {
//         toast.error("Please log in to view your jobs.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/company/posted-jobs/",
//           {
//             params: { company_email: companyData.email },
//           }
//         );
//         setJobs(response.data);
//       } catch (err) {
//         const errorMessage =
//           err.response?.data?.error || "Failed to fetch jobs.";
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // const handleDeleteJob = async (jobId) => {
//   //   if (!window.confirm("Are you sure you want to delete this job?")) return;

//   //   try {
//   //     await axios.delete(
//   //       `http://127.0.0.1:8000/api/company/delete-job/${jobId}/`
//   //     );
//   //     setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
//   //     toast.success("Job deleted successfully!");
//   //   } catch (err) {
//   //     const errorMessage =
//   //       err.response?.data?.error || "Failed to delete the job.";
//   //     toast.error(errorMessage);
//   //   }
//   // };

//   return (
//     <div className="my-4">
//       <ToastContainer position="top-center" autoClose={2000} />

//       {loading ? (
//         <p className="text-center text-dark m-4 p-3 border-0">
//           Loading jobs...
//         </p>
//       ) : (
//         <div className="">
//           <h2 className="text-center text-white mb-4">Your Posted Jobs</h2>
//           {jobs.length === 0 ? (
//             <p>No jobs posted yet.</p>
//           ) : (
//             <div className="row m-4">
//               {jobs.map((job) => (
//                 <div key={job.id} className="col-12 mb-4">
//                   <div className="job-card p-4 border rounded shadow-sm">
//                     <p className="job-text">
//                       <strong>Job Title:</strong> {job.title}
//                     </p>
//                     <p className="job-text">
//                       <strong>Tags:</strong> {job.tags}
//                     </p>
//                     <p className="job-text">
//                       <strong>Type:</strong> {job.job_type}
//                     </p>
//                     <p className="job-text">
//                       <strong>Salary:</strong> {job.salary_range}
//                     </p>
//                     <p className="job-text">
//                       <strong>Time:</strong> {job.job_time}
//                     </p>
//                     <p className="job-text">
//                       <strong>Description:</strong> {job.description}
//                     </p>
//                     <div className="d-flex justify-content-center">
//                       <button
//                         className="btn btn-danger btn-sm"
//                         // onClick={() => handleDeleteJob(job.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostedJobs;

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PostedJobs.css";

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

  return (
    <div className="my-4">
      <ToastContainer position="top-center" autoClose={2000} />

      {loading ? (
        <p className="text-center text-dark m-4 p-3 border-0">
          Loading jobs...
        </p>
      ) : (
        <div className="post-job-div">
          <h2 className="text-center text-white mb-4">Your Posted Jobs</h2>
          {jobs.length === 0 ? (
            <p>No jobs posted yet.</p>
          ) : (
            <div className="row m-4">
              {jobs.map((job) => (
                <div key={job.id} className="col-12 mb-4">
                  <div className="job-card p-4 border rounded shadow-sm">
                    <p className="job-text">
                      <strong>Job Title:</strong> {job.title}
                    </p>
                    <p className="job-text">
                      <strong>Tags:</strong> {job.tags}
                    </p>
                    <p className="job-text">
                      <strong>Type:</strong> {job.job_type}
                    </p>
                    <p className="job-text">
                      <strong>Salary:</strong> {job.salary_range}
                    </p>
                    <p className="job-text">
                      <strong>Time:</strong> {job.job_time}
                    </p>
                    <p className="job-text">
                      <strong>Description:</strong> {job.description}
                    </p>
                    <div className="d-flex justify-content-center">
                      <button
                        className="delete-btn btn btn-danger btn-sm"
                        onClick={() => handleDeleteJob(job.id)}
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
