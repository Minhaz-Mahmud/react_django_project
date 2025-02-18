/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import "./JobApplications.css";

const ApplicationFeed = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    candidateEmail: "",
    message: "",
  });

  useEffect(() => {
    const companyData = sessionStorage.getItem("companyData");
    if (companyData) {
      const parsedCompanyData = JSON.parse(companyData);
      setCompanyId(parsedCompanyData.id);
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchApplications(currentPage, companyId);
    }
  }, [currentPage, companyId]);

  const fetchApplications = async (page, companyId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications/${companyId}/?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch applications.");
      }
      const data = await response.json();
      setApplications(data.results || []);
      setHasNextPage(!!data.next);
      setHasPreviousPage(!!data.previous);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications_del/${applicationId}/`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete application.");
      }
      setApplications(applications.filter((app) => app.id !== applicationId));
    } catch (error) {
      console.error("Error deleting application:", error);
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

  const viewCandidateDetails = (candidateId) => {
    navigate(`/candidate/apply/details/${candidateId}`);
  };

  const openEmailModal = (candidateEmail, jobId, candidateId, companyId) => {
    setEmailData({
      candidateEmail,
      jobId,
      candidateId,
      companyId,
      message: "",
    });
    setIsModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsModalOpen(false);
    setEmailData({ candidateEmail: "", subject: "", message: "" });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/send-email/",
        {
          candidateEmail: emailData.candidateEmail,
          message: emailData.message,
          jobId: emailData.jobId,
          candidateId: emailData.candidateId,
          companyId: emailData.companyId,
        }
      );
      alert(response.data.success || "Email sent successfully!");
      closeEmailModal();
    } catch (error) {
      alert(error.response?.data?.error || "Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-feed-container">
      <br />
      <br />
      <br />
      <br />
      <h4>Applications for Company ID: {companyId}</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="application-feed-div">
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <ul className="list-group">
              {applications.map((app) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={app.id}
                >
                  <div>
                    <strong>{app.candidate__full_name}</strong> applied for{" "}
                    <em>{app.job_title}</em> (Job ID: {app.job_id}) on{" "}
                    {new Date(app.time).toLocaleDateString()}
                  </div>
                  <div>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => viewCandidateDetails(app.candidate_id)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => deleteApplication(app.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        openEmailModal(
                          app.candidate__email,
                          app.job_id,
                          app.candidate_id,
                          companyId
                        )
                      }
                    >
                      Send Email
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="pagination">
            {hasPreviousPage && (
              <button onClick={handlePreviousPage}>Previous</button>
            )}
            <span>Page {currentPage}</span>
            {hasNextPage && <button onClick={handleNextPage}>Next</button>}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEmailModal}
        className="container mt-5 modal-dialog modal-dialog-centered"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Send Email</h5>
            <button
              type="button"
              className="m-2 p-2 btn-close"
              onClick={closeEmailModal}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSendEmail}>
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={emailData.candidateEmail}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      candidateEmail: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message:</label>
                <textarea
                  className="form-control"
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData({ ...emailData, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                {loading ? "Sending..." : "Send Email"}
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationFeed;
