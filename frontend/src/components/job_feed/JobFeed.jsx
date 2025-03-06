/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./JobFeed.css";
import {
  FaMapMarkerAlt,
  FaCircle,
  FaBriefcase,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const JobFeed = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [showUpButton, setShowUpButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowUpButton(true);
      } else {
        setShowUpButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchJobPosts(currentPage);
    checkSessionData();
  }, [currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Check if there's any session data
  const checkSessionData = () => {
    const storedUserData = sessionStorage.getItem("candidateData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setHasSession(true);
    }
  };

  const fetchJobPosts = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/job-posts/?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job posts.");
      }
      const data = await response.json();
      setJobPosts(data.results || []);
      setHasNextPage(!!data.next);
      setHasPreviousPage(!!data.previous);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (companyId, job_id, job_title) => {
    if (!userData) {
      alert("You need to log in to apply!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/apply/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_id: userData.id,
          company_id: companyId,
          job_id: job_id,
          job_title: job_title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application.");
      }

      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while applying. Please try again.");
    }
  };

  const calculateTimeAgo = (postedTime) => {
    const now = new Date();
    const postedDate = new Date(postedTime);
    const diffInMs = now - postedDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleJobTypeChange = (e) => {
    setJobTypeFilter(e.target.value);
  };

  const filteredJobs = jobPosts.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (jobTypeFilter === "" || job.job_type === jobTypeFilter)
    );
  });

  const jobTypes = ["Hybrid", "Remote", "Onsite"];

  return (
    <div className="job-feed-container">
      <div className="job-feed-hero">
        <div className="hero-content">
          <h1 className="text-light">Find Your Dream Job</h1>
          <p>Discover thousands of job opportunities with top employers</p>
          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for job titles, companies, or keywords..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="job-feed-content">
        <div className="content-header">
          <h2>Latest Opportunities</h2>
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select
              value={jobTypeFilter}
              onChange={handleJobTypeChange}
              className="job-type-filter"
            >
              <option value="">All Job Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding opportunities for you...</p>
          </div>
        ) : (
          <>
            {filteredJobs.length === 0 ? (
              <div className="no-jobs-message">
                <FaBriefcase size={48} />
                <h3>No jobs found</h3>
                <p>
                  Try adjusting your search criteria or check back later for new
                  opportunities.
                </p>
              </div>
            ) : (
              <div className="job-cards-container">
                {filteredJobs.map((post) => (
                  <div key={post.id} className="job-card">
                    <div className="job-card-header">
                      <div className="job-header-info">
                        <h3 className="job-title">{post.title}</h3>
                        <p className="company-name">{post.company}</p>
                      </div>
                      <div className="job-type-badge">{post.job_type}</div>
                    </div>

                    <div className="job-card-body">
                      <div className="job-details">
                        <div className="job-detail-item">
                          <FaMapMarkerAlt className="detail-icon location-icon" />
                          <span>{post.job_location}</span>
                        </div>
                        <div className="job-detail-item">
                          <span className="time-icon">⏳</span>
                          <span>{calculateTimeAgo(post.posted_at)}</span>
                        </div>
                        <div className="job-detail-item status-indicator">
                          <FaCircle
                            className={
                              post.active_recruiting
                                ? "active-icon"
                                : "inactive-icon"
                            }
                          />
                          <span>
                            {post.active_recruiting
                              ? "Actively Recruiting"
                              : "Recruiting Paused"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="job-card-footer">
                      <div className="footer-left">
                        <span className="posted-date">
                          Posted:{" "}
                          {new Date(post.posted_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="footer-right">
                        <button className="btn btn-outline view-details-btn">
                          View Details
                        </button>
                        {userData ? (
                          <button
                            className="btn btn-primary apply-btn"
                            onClick={() =>
                              handleApply(post.company, post.id, post.title)
                            }
                          >
                            Apply Now
                          </button>
                        ) : (
                          <Link to="/signin">
                            <button className="btn btn-secondary login-to-apply-btn text-dark">
                              Login to Apply
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pagination">
              <button
                className={`pagination-btn prev-btn ${
                  !hasPreviousPage ? "disabled" : ""
                }`}
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage}
              >
                <FaChevronLeft /> Previous
              </button>
              <span className="page-indicator">Page {currentPage}</span>
              <button
                className={`pagination-btn next-btn ${
                  !hasNextPage ? "disabled" : ""
                }`}
                onClick={handleNextPage}
                disabled={!hasNextPage}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
      {showUpButton && (
        <button className="up-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default JobFeed;
