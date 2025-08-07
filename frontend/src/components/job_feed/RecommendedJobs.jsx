import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]); // New state for applied jobs
  const navigate = useNavigate();

  // New function to fetch applied job IDs
  const fetchAppliedJobIds = async (candidateId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/candidate-applied-job-ids/${candidateId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setAppliedJobIds(data.applied_job_ids || []);
      }
    } catch (error) {
      console.error("Error fetching applied job IDs:", error);
    }
  };

  // Helper function to check if user has applied to a job
  const hasAppliedToJob = (jobId) => {
    return appliedJobIds.includes(jobId);
  };

  const handleApply = async (companyId, job_id, job_title) => {
    if (!userData) {
      alert("You need to log in to apply!");
      return;
    }

    // Check if already applied
    if (hasAppliedToJob(job_id)) {
      alert("You have already applied to this job!");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to apply for the position: "${job_title}"?`
    );
    if (!confirmed) {
      return;
    }

    console.log("Apply Data:", {
      candidate_id: userData.id,
      company_id: companyId,
      job_id: job_id,
      job_title: job_title,
    });

    if (!companyId) {
      alert("Error: Company ID is missing. Please try again.");
      console.error("Company ID is null or undefined:", companyId);
      return;
    }

    if (!job_id) {
      alert("Error: Job ID is missing. Please try again.");
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
        const errorData = await response.json();
        if (
          response.status === 400 &&
          errorData.message?.includes("already applied")
        ) {
          alert(errorData.message);
          // Update applied job IDs to reflect this
          setAppliedJobIds((prev) => [...prev, job_id]);
          return;
        }
        throw new Error("Failed to submit application.");
      }

      alert("Application submitted successfully!");
      // Add the job ID to applied jobs list
      setAppliedJobIds((prev) => [...prev, job_id]);
    } catch (error) {
      console.error("Apply error:", error);
      alert("An error occurred while applying. Please try again.");
    }
  };

  useEffect(() => {
    const firstRefresh = sessionStorage.getItem("firstRefresh");
    if (!firstRefresh) {
      sessionStorage.setItem("firstRefresh", "true");
      window.location.reload();
      return;
    }

    const storedUserData = sessionStorage.getItem("candidateData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      navigate("/signin");
      return;
    }
  }, [navigate]);

  // Fetch applied job IDs when user data is available
  useEffect(() => {
    if (userData && userData.id) {
      fetchAppliedJobIds(userData.id);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData || !userData.skills) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setMessage("");
        const recResponse = await axios.post(
          "http://127.0.0.1:8000/api/recommendations/",
          {
            skills: userData.skills,
          },
          {
            timeout: 30000, // Increased from 8000 to 15000
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseStatus = recResponse.data.status || "";
        const responseMessage = recResponse.data.message || "";

        setStatus(responseStatus);
        setMessage(responseMessage);

        if (!recResponse.data.recommended_ids?.length) {
          setJobs([]);
          if (responseStatus === "error") {
            setError(responseMessage || "No recommendations available");
          } else {
            setError(null);
          }
          return;
        }

        // Also increased timeout for the second request
        const jobsResponse = await axios.get(
          "http://127.0.0.1:8000/api/job-posts/",
          {
            params: { ids: recResponse.data.recommended_ids.join(",") },
            timeout: 15000, // Increased timeout here as well
          }
        );

        const validatedJobs = jobsResponse.data.map((job) => {
          console.log("Processing job:", job);
          return {
            id: job.id,
            title: job.title || "Untitled Position",
            company: {
              id: job.company?.id || null,
              name: job.company?.name || "Unknown Company",
              email: job.company?.email || "",
            },
            job_location: job.job_location || "Location not specified",
            tags: job.tags || "",
            job_type: job.job_type || "Not specified",
            salary_range: job.salary_range || "Salary not disclosed",
            job_time: job.job_time || "Schedule not specified",
            description: job.description || "No description provided",
            active_recruiting: job.active_recruiting || false,
            posted_at: job.posted_at || new Date().toISOString(),
            updated_at: job.updated_at || new Date().toISOString(),
          };
        });

        setJobs(validatedJobs);
      } catch (err) {
        console.error("API Error:", err);
        // More specific error message based on error type
        if (err.code === "ECONNABORTED") {
          setError(
            "Request timed out. The server is taking too long to respond. Please try again."
          );
        } else if (err.response) {
          // The request was made and the server responded with a status code
          setError(
            `Server error: ${err.response.status} - ${err.response.statusText}`
          );
        } else if (err.request) {
          // The request was made but no response was received
          setError(
            "No response received from server. Please check your connection and try again."
          );
        } else {
          // Something happened in setting up the request
          setError(
            "Failed to load job recommendations. Please try again later."
          );
        }
        setStatus("error");
        setMessage("");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay before fetching to ensure state is properly set
    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, [userData]);

  if (loading || !userData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <p>Loading job recommendations...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h2
        style={{
          marginBottom: "25px",
          color: "#2c3e50",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        Recommended Jobs for {userData?.name || "You"} {status && `(${status})`}
      </h2>

      {userData?.skills && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h4 style={{ color: "#495057", marginBottom: "10px" }}>
            Your Skills:
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {userData.skills.split(",").map((skill, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {message && status !== "error" && (
        <div
          style={{
            padding: "15px",
            backgroundColor: status === "success" ? "#e8f5e9" : "#fff3e0",
            color: status === "success" ? "#2e7d32" : "#f57c00",
            marginBottom: "20px",
            borderRadius: "4px",
            border: `1px solid ${status === "success" ? "#c8e6c9" : "#ffcc02"}`,
          }}
        >
          <strong>Info:</strong> {message}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ef9a9a",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {jobs.length === 0 && !loading && !error ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <p>No job recommendations found matching your profile.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "25px" }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "25px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3
                  style={{
                    marginTop: 0,
                    color: "#2c3e50",
                    fontSize: "1.4rem",
                  }}
                >
                  {job.title}
                </h3>
                <span
                  style={{
                    backgroundColor: job.active_recruiting
                      ? "#e8f5e9"
                      : "#ffebee",
                    color: job.active_recruiting ? "#2e7d32" : "#c62828",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    height: "fit-content",
                  }}
                >
                  {job.active_recruiting ? "Actively Hiring" : "Closed"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  margin: "15px 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "8px",
                      color: "#7f8c8d",
                    }}
                  >
                    🏢
                  </span>
                  <span>{job.company.name}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "8px",
                      color: "#7f8c8d",
                    }}
                  >
                    📍
                  </span>
                  <span>{job.job_location}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "8px",
                      color: "#7f8c8d",
                    }}
                  >
                    💼
                  </span>
                  <span>{job.job_type}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "8px",
                      color: "#7f8c8d",
                    }}
                  >
                    💰
                  </span>
                  <span>{job.salary_range}</span>
                </div>
              </div>

              {job.tags && (
                <div style={{ margin: "20px 0" }}>
                  <h4
                    style={{
                      marginBottom: "10px",
                      color: "#34495e",
                    }}
                  >
                    Required Skills:
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {job.tags
                      .split(",")
                      .filter((tag) => tag.trim())
                      .map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                          }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div style={{ margin: "20px 0" }}>
                <h4
                  style={{
                    marginBottom: "10px",
                    color: "#34495e",
                  }}
                >
                  Job Description:
                </h4>
                <div
                  style={{
                    whiteSpace: "pre-line",
                    lineHeight: "1.7",
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "6px",
                  }}
                >
                  {job.description}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                  paddingTop: "15px",
                  borderTop: "1px solid #eee",
                  color: "#7f8c8d",
                  fontSize: "0.9rem",
                }}
              >
                <span>
                  Posted:{" "}
                  {new Date(job.posted_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>

                {/* Updated button logic */}
                {hasAppliedToJob(job.id) ? (
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "not-allowed",
                      fontWeight: "500",
                      opacity: "0.8",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    disabled
                  >
                    ✓ Already Applied
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      console.log("Job data for apply:", {
                        company: job.company,
                        job_id: job.id,
                        job_title: job.title,
                      });
                      handleApply(job.company?.id, job.id, job.title);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#2980b9")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#3498db")
                    }
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedJobs;
