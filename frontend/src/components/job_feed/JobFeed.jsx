import React, { useState, useEffect } from "react";
import "./JobFeed.css";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";

const JobFeed = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchJobPosts(currentPage);
    checkSessionData();
  }, [currentPage]);

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

  const handleApply = async (companyId,job_id,job_title) => {
    if (!userData) {
      alert("You need to log in to apply!");
      return;
    }

    // Log the company_id to the console
    console.log("Applying for company with ID:", companyId);

    try {
      const response = await fetch("http://127.0.0.1:8000/apply/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_id: userData.id,
          company_id: companyId,
          job_id:job_id,
          job_title:job_title,
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

  return (
    <div className="job-feed-container mt-4">
      <h4 className="mb-4">Latest Job Posts</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="job-feed-content">
          {jobPosts.length === 0 ? (
            <p>No job posts available.</p>
          ) : (
            <div className="job-cards-container">
              {jobPosts.map((post) => (
                <div key={post.id} className="job-card">
                  <div className="job-card-header">
                    <img
                      src={post.company_logo || "default-logo.png"}
                      alt="Company Logo"
                      className="company-logo"
                    />
                    <div>
                      <h5 className="job-title">{post.title}</h5>
                      <p className="company-name">{post.company}</p>
                      {/* <p className="company-id">{post.company_id}</p> */}

                    </div>
                  </div>
                  <div className="job-card-body">
                    <p className="job-details">
                      <span className="job-location">
                        <FaMapMarkerAlt size={16} color="red" />{" "}
                        {post.job_location}
                      </span>
                      <span className="job-posted-time">
                        ⏳ {calculateTimeAgo(post.posted_at)}
                      </span>
                      <span className="job-post-active-recruiting">
                        {post.active_recruiting ? (
                          <>
                            <FaCircle size={12} color="green" /> Active
                            Recruiting
                          </>
                        ) : (
                          <>
                            <FaCircle size={12} color="grey" /> Recruiting
                          </>
                        )}
                      </span>
                    </p>
                    <button className="btn job-type">{post.job_type}</button>
                  </div>
                  <div className="job-card-footer">
                    <span className="posted-time">
                      <strong>Posted at:</strong>
                      <span className="text-primary">
                        {" "}
                        {new Date(post.posted_at).toLocaleDateString()}
                      </span>
                    </span>
                    <button className="btn btn-outline-primary btn-sm">
                      View Details
                    </button>
                    {userData ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleApply(post.company,post.id,post.title)}
                      >
                        Apply
                      </button>
                    ) : (
                      <p className="text-danger mt-2">Login to Apply</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="pagination mt-3">
            {hasPreviousPage && (
              <button
                className="btn btn-secondary"
                onClick={handlePreviousPage}
              >
                Previous
              </button>
            )}
            <span>Page {currentPage}</span>
            {hasNextPage && (
              <button className="btn btn-secondary" onClick={handleNextPage}>
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFeed;