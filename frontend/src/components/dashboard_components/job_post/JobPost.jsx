/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./jobPost.css";

const JobPost = () => {
  const [title, setTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [tags, setTags] = useState("");
  const [jobType, setJobType] = useState("Remote");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobTime, setJobTime] = useState("");
  const [description, setDescription] = useState("");
  const [activeRecruiting, setActiveRecruiting] = useState(true);

  // Validation function for salary range
  const validateSalaryRange = (range) => {
    // Regex to match salary ranges with optional $ and comma separators
    const salaryRangeRegex = /^(\$?[\d,]+)\s*-\s*(\$?[\d,]+)$/;
    const match = range.match(salaryRangeRegex);

    if (!match) {
      return false;
    }

    // Remove $ and commas, convert to numbers
    const lowerBound = parseFloat(match[1].replace(/[$,]/g, ""));
    const upperBound = parseFloat(match[2].replace(/[$,]/g, ""));

    // Check if lower bound is less than upper bound
    return lowerBound < upperBound;
  };

  // Validation function for job time range
  const validateJobTimeRange = (timeRange) => {
    // Regex to match time ranges like 9am-5pm, 10am-6pm, etc.
    const timeRangeRegex = /^(\d{1,2})(am|pm)\s*-\s*(\d{1,2})(am|pm)$/i;
    const match = timeRange.match(timeRangeRegex);

    if (!match) {
      return false;
    }

    const startHour = parseInt(match[1]);
    const startPeriod = match[2].toLowerCase();
    const endHour = parseInt(match[3]);
    const endPeriod = match[4].toLowerCase();

    // Validate hours
    if (startHour < 1 || startHour > 12 || endHour < 1 || endHour > 12) {
      return false;
    }

    // If periods are different, we need special handling
    if (startPeriod !== endPeriod) {
      return startPeriod === "am" && endPeriod === "pm";
    }

    // If same period (am or pm), end hour must be later
    return endHour > startHour;
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    // Validate salary range
    if (!validateSalaryRange(salaryRange)) {
      toast.error(
        "Please enter a valid salary range (e.g., $40,000 - $50,000)."
      );
      return;
    }

    // Validate job time range
    if (!validateJobTimeRange(jobTime)) {
      toast.error("Please enter a valid job time range (e.g., 9am-5pm).");
      return;
    }

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
          job_location: jobLocation,
          tags,
          job_type: jobType,
          salary_range: salaryRange,
          job_time: jobTime,
          description,
          active_recruiting: activeRecruiting,
        }
      );

      toast.success("Job posted successfully!");

      // Reset form fields
      setTitle("");
      setJobLocation("");
      setTags("");
      setJobType("Remote");
      setSalaryRange("");
      setJobTime("");
      setDescription("");
      setActiveRecruiting(true);
    } catch (err) {
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
      <div className="form-container">
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
            <label className="text-dark">Job Location:</label>
            <input
              name="job_location"
              placeholder="Enter job location"
              type="text"
              className="form-control"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
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
              placeholder="e.g., $40,000 - $50,000"
              type="text"
              className="form-control"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              required
            />
            <small className="form-text text-muted">
              Format: $40,000 - $50,000 (low to high)
            </small>
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
              required
            />
            <small className="form-text text-muted">
              Format: 9am-5pm (start to end time)
            </small>
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
  );
};

export default JobPost;
