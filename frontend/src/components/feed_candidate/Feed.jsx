import React, { useState, useEffect } from "react";

const Feed = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

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
      setJobPosts(data.results || []); // Use empty array if no results
      setHasNextPage(!!data.next); // Check if there is a next page
      setHasPreviousPage(!!data.previous); // Check if there is a previous page
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPosts(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <h1>Latest Job Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {jobPosts.length === 0 ? (
            <p>No job posts available.</p>
          ) : (
            <ul>
              {jobPosts.map((post) => (
                <li key={post.id}>
                  <h2>{post.title}</h2>
                  <p>
                    <strong>Company:</strong> {post.company}
                  </p>
                  <p>
                    <strong>Tags:</strong> {post.tags}
                  </p>
                  <p>
                    <strong>Job Type:</strong> {post.job_type}
                  </p>
                  <p>
                    <strong>Salary:</strong> {post.salary_range}
                  </p>
                  <p>
                    <strong>Job Time:</strong> {post.job_time}
                  </p>
                  <p>
                    <strong>Description:</strong> {post.description}
                  </p>
                  <p>
                    <strong>Posted At:</strong>{" "}
                    {new Date(post.posted_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="pagination">
            {!hasPreviousPage ? null : (
              <button onClick={handlePreviousPage}>Previous</button>
            )}
            <span>Page {currentPage}</span>
            {!hasNextPage ? null : (
              <button onClick={handleNextPage}>Next</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
