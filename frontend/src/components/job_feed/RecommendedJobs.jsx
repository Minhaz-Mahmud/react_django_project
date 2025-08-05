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
  const navigate = useNavigate();

  const handleApply = async (companyId, job_id, job_title) => {
    if (!userData) {
      alert("You need to log in to apply!");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to apply for the position: "${job_title}"?`);
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
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to submit application.");
      }

      alert("Application submitted successfully!");
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

  useEffect(() => {
    if (!userData || !userData.skills) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setMessage("");
        
        // Increased timeout to 15 seconds (15000ms) to accommodate slower responses
        const recResponse = await axios.post(
          "http://127.0.0.1:8000/api/recommendations/",
          { 
            skills: userData.skills
          },
          { 
            timeout: 30000, // Increased from 8000 to 15000
            headers: {
              'Content-Type': 'application/json',
            }
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
            params: { ids: recResponse.data.recommended_ids.join(',') },
            timeout: 15000 // Increased timeout here as well
          }
        );

        const validatedJobs = jobsResponse.data.map(job => {
          console.log("Processing job:", job);
          return {
            id: job.id,
            title: job.title || "Untitled Position",
            company: {
              id: job.company?.id || null,
              name: job.company?.name || "Unknown Company",
              email: job.company?.email || ""
            },
            job_location: job.job_location || "Location not specified",
            tags: job.tags || "",
            job_type: job.job_type || "Not specified",
            salary_range: job.salary_range || "Salary not disclosed",
            job_time: job.job_time || "Schedule not specified",
            description: job.description || "No description provided",
            active_recruiting: job.active_recruiting || false,
            posted_at: job.posted_at || new Date().toISOString(),
            updated_at: job.updated_at || new Date().toISOString()
          };
        });

        setJobs(validatedJobs);

      } catch (err) {
        console.error("API Error:", err);
        // More specific error message based on error type
        if (err.code === 'ECONNABORTED') {
          setError("Request timed out. The server is taking too long to respond. Please try again.");
        } else if (err.response) {
          // The request was made and the server responded with a status code
          setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError("No response received from server. Please check your connection and try again.");
        } else {
          // Something happened in setting up the request
          setError("Failed to load job recommendations. Please try again later.");
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <p>Loading job recommendations...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ 
        marginBottom: '25px',
        color: '#2c3e50',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        Recommended Jobs for {userData?.name || 'You'} {status && `(${status})`}
      </h2>

      {userData?.skills && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ color: '#495057', marginBottom: '10px' }}>Your Skills:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {userData.skills.split(",").map((skill, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {message && status !== "error" && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: status === "success" ? '#e8f5e9' : '#fff3e0', 
          color: status === "success" ? '#2e7d32' : '#f57c00',
          marginBottom: '20px',
          borderRadius: '4px',
          border: `1px solid ${status === "success" ? '#c8e6c9' : '#ffcc02'}`
        }}>
          <strong>Info:</strong> {message}
        </div>
      )}
      
      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ef9a9a'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {jobs.length === 0 && !loading && !error ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p>No job recommendations found matching your profile.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '25px' }}>
          {jobs.map(job => (
            <div key={job.id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '25px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ 
                  marginTop: 0, 
                  color: '#2c3e50',
                  fontSize: '1.4rem'
                }}>
                  {job.title}
                </h3>
                <span style={{
                  backgroundColor: job.active_recruiting ? '#e8f5e9' : '#ffebee',
                  color: job.active_recruiting ? '#2e7d32' : '#c62828',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  height: 'fit-content'
                }}>
                  {job.active_recruiting ? 'Actively Hiring' : 'Closed'}
                </span>
              </div>

              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                margin: '15px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    marginRight: '8px',
                    color: '#7f8c8d'
                  }}>🏢</span>
                  <span>{job.company.name}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    marginRight: '8px',
                    color: '#7f8c8d'
                  }}>📍</span>
                  <span>{job.job_location}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    marginRight: '8px',
                    color: '#7f8c8d'
                  }}>💼</span>
                  <span>{job.job_type}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    marginRight: '8px',
                    color: '#7f8c8d'
                  }}>💰</span>
                  <span>{job.salary_range}</span>
                </div>
              </div>

              {job.tags && (
                <div style={{ margin: '20px 0' }}>
                  <h4 style={{ 
                    marginBottom: '10px',
                    color: '#34495e'
                  }}>
                    Required Skills:
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '10px'
                  }}>
                    {job.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                      <span 
                        key={index} 
                        style={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ margin: '20px 0' }}>
                <h4 style={{ 
                  marginBottom: '10px',
                  color: '#34495e'
                }}>
                  Job Description:
                </h4>
                <div style={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: '1.7',
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '6px'
                }}>
                  {job.description}
                </div>
              </div>

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                paddingTop: '15px',
                borderTop: '1px solid #eee',
                color: '#7f8c8d',
                fontSize: '0.9rem'
              }}>
                <span>
                  Posted: {new Date(job.posted_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <button 
                  onClick={() => {
                    console.log("Job data for apply:", {
                      company: job.company,
                      job_id: job.id,
                      job_title: job.title
                    });
                    handleApply(job.company?.id, job.id, job.title);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedJobs;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// //import './RecommendedJobs.css';  // Create this for styling

// const RecommendedJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // 1. Get recommendations
//         const recResponse = await axios.get(
//           "http://127.0.0.1:8000/api/recommendations/",
//           { timeout: 8000 }
//         );
        
//         setStatus(recResponse.data.status || "");
        
//         // 2. If no recommendations, show message
//         if (!recResponse.data.recommended_ids?.length) {
//           setJobs([]);
//           setError(recResponse.data.message || "No recommendations available");
//           return;
//         }

//         // 3. Get full job details
//         const jobsResponse = await axios.get(
//           "http://127.0.0.1:8000/api/job-posts/",
//           { params: { ids: recResponse.data.recommended_ids.join(',') } }
//         );

//         // 4. Match and order jobs based on recommendations
//         const recommendedJobs = recResponse.data.recommended_ids
//           .map(id => jobsResponse.data.find(job => job.id === id))
//           .filter(job => job);  // Remove undefined

//         setJobs(recommendedJobs);
        
//         if (recResponse.data.status === "partial") {
//           setError(recResponse.data.message);
//         }

//       } catch (err) {
//         let errorMessage = "Failed to load recommendations";
        
//         if (err.response) {
//           errorMessage = err.response.data.message || 
//                         `Server error: ${err.response.status}`;
//         } else if (err.request) {
//           errorMessage = "Network error - please check your connection";
//         }
        
//         setError(errorMessage);
//         setJobs([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Finding your personalized job recommendations...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="recommended-jobs-container">
//       <h2>Recommended Jobs {status && `(${status})`}</h2>
      
//       {error && (
//         <div className="alert-message">
//           {error}
//         </div>
//       )}

//       {jobs.length === 0 ? (
//         <p className="no-jobs">No matching jobs found. Try updating your skills.</p>
//       ) : (
//         <div className="jobs-grid">
//           {jobs.map(job => (
//             <div key={job.id} className="job-card">
//               <h3>{job.title}</h3>
//               <p className="company">{job.company_name}</p>
//               <p className="location">{job.job_location}</p>
//               <div className="tags">
//                 {job.tags.split(',').map(tag => (
//                   <span key={tag} className="tag">{tag.trim()}</span>
//                 ))}
//               </div>
//               <p className="description">
//                 {job.description.length > 150 
//                   ? `${job.description.substring(0, 150)}...` 
//                   : job.description}
//               </p>
//               <button className="apply-btn">View Details</button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendedJobs;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// //import "./RecommendedJobs.css";

// const RecommendedJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [status, setStatus] = useState("");
//   const [retryCount, setRetryCount] = useState(0);

//   const fetchRecommendedJobs = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // 1. First get recommendations from the recommendations endpoint
//       const recResponse = await axios.get(
//         "http://127.0.0.1:8000/api/recommendations/",
//         { timeout: 8000 }
//       );
      
//       setStatus(recResponse.data.status || "");
      
//       // 2. If no recommendations, show message
//       if (!recResponse.data.recommended_ids?.length) {
//         setJobs([]);
//         setError(recResponse.data.message || "No recommendations available");
//         return;
//       }

//       // 3. Now get full job details using the job-posts endpoint
//       const jobsResponse = await axios.get(
//         "http://127.0.0.1:8000/api/job-posts/",
//         { 
//           params: { 
//             ids: recResponse.data.recommended_ids.join(',') 
//           },
//           timeout: 8000
//         }
//       );

//       // 4. Match and order jobs based on recommendations
//       const recommendedJobs = recResponse.data.recommended_ids
//         .map(id => jobsResponse.data.find(job => job.id === id))
//         .filter(job => job);  // Remove undefined

//       setJobs(recommendedJobs);
      
//       if (recResponse.data.status === "partial") {
//         setError(recResponse.data.message);
//       }

//     } catch (err) {
//       let errorMessage = "Failed to load recommendations";
      
//       if (err.response) {
//         if (err.response.status === 404) {
//           errorMessage = "Job posts endpoint not found - please contact support";
//         } else if (err.response.status === 500) {
//           errorMessage = "Server error - please try again later";
//         } else {
//           errorMessage = err.response.data.message || 
//                        `Error: ${err.response.status}`;
//         }
//       } else if (err.request) {
//         errorMessage = "Network error - please check your connection";
//       } else {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//       setJobs([]);
      
//       // Auto-retry after 5 seconds (max 3 retries)
//       if (retryCount < 3) {
//         setTimeout(() => {
//           setRetryCount(prev => prev + 1);
//         }, 5000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecommendedJobs();
//   }, [retryCount]);

//   const handleRetry = () => {
//     setRetryCount(0);
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Finding your personalized job recommendations...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="recommended-jobs-container">
//       <div className="header-section">
//         <h2>Recommended Jobs {status && `(${status})`}</h2>
//         {retryCount > 0 && (
//           <button onClick={handleRetry} className="retry-button">
//             Retry
//           </button>
//         )}
//       </div>
      
//       {error && (
//         <div className={`alert-message ${retryCount >= 3 ? 'error' : 'warning'}`}>
//           {error}
//           {retryCount < 3 && (
//             <span> Retrying in {5 - (retryCount * 1)} seconds...</span>
//           )}
//         </div>
//       )}

//       {jobs.length === 0 && !loading ? (
//         <div className="empty-state">
//           <img src="/images/no-jobs.svg" alt="No jobs found" className="empty-image" />
//           <p className="no-jobs-message">No matching jobs found</p>
//           <p className="suggestion">Try updating your skills or broadening your search criteria</p>
//         </div>
//       ) : (
//         <div className="jobs-grid">
//           {jobs.map(job => (
//             <div key={job.id} className="job-card">
//               <div className="job-header">
//                 <h3>{job.title}</h3>
//                 <span className="salary">
//                   {job.salary_range || 'Competitive salary'}
//                 </span>
//               </div>
//               <p className="company">
//                 <i className="fas fa-building"></i> {job.company?.name || 'Company not specified'}
//               </p>
//               <p className="location">
//                 <i className="fas fa-map-marker-alt"></i> {job.job_location || 'Location not specified'}
//               </p>
              
//               {job.tags && (
//                 <div className="tags">
//                   {job.tags.split(',').map((tag, index) => (
//                     <span key={index} className="tag">{tag.trim()}</span>
//                   ))}
//                 </div>
//               )}
              
//               <div className="job-description">
//                 {job.description ? (
//                   job.description.length > 150 
//                     ? `${job.description.substring(0, 150)}...` 
//                     : job.description
//                 ) : 'No description available'}
//               </div>
              
//               <div className="job-footer">
//                 <span className="post-date">
//                   <i className="far fa-clock"></i> Posted {new Date(job.posted_at).toLocaleDateString()}
//                 </span>
//                 <button className="apply-btn">
//                   <i className="fas fa-paper-plane"></i> Apply Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendedJobs;