/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const JobPost = () => {

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [jobType, setJobType] = useState("Remote");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobTime, setJobTime] = useState("9am-5pm");
  const [description, setDescription] = useState("");
  const [activeRecruiting, setActiveRecruiting] = useState(true);

  const handlePostJob = async (e) => {
    e.preventDefault();

    const companyData = JSON.parse(sessionStorage.getItem("companyData"));

    if (!companyData || !companyData.email) {
      toast.error("Please log in to post a job.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/company/post-job/",
        {
          company_email: companyData.email,
          title,
          tags,
          job_type: jobType,
          salary_range: salaryRange,
          job_time: jobTime,
          description,
          active_recruiting: activeRecruiting,
        }
      );

      toast.success("Job posted successfully!");
      setTitle("");
      setTags("");
      setSalaryRange("");
      setDescription("");
    } 
    catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="post-job-container">
      <ToastContainer
        className="toast-class"
        position="top-center"
        autoClose={2000}
      />
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center">Post a Job</h2>
          <form onSubmit={handlePostJob}>
            <div className="form-group">
              <label className="text-dark">Job Title:</label>
              <input
                name="title"
                placeholder="Enter job title"
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="text-dark">Tags (comma-separated):</label>
              <input
                name="tags"
                placeholder="e.g., Python, Django, REST"
                type="text"
                className="form-control"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="text-dark">Job Type:</label>
              <select
                className="form-control"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div className="form-group">
              <label className="text-dark">Salary Range:</label>
              <input
                name="salaryRange"
                placeholder="e.g., 50,000 - 70,000"
                type="text"
                className="form-control"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="text-dark">Job Time:</label>
              <input
                name="jobTime"
                placeholder="e.g., 9am-5pm"
                type="text"
                className="form-control"
                value={jobTime}
                onChange={(e) => setJobTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="text-dark">Description:</label>
              <textarea
                name="description"
                placeholder="Enter job description"
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="text-dark">Active Recruiting:</label>
              <input
                type="checkbox"
                className="form-check-input"
                checked={activeRecruiting}
                onChange={() => setActiveRecruiting(!activeRecruiting)}
              />
              <span className="ms-2">Yes</span>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Post Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPost;
