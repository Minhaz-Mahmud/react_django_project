/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
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
    jobId: "",
    candidateId: "",
    companyId: "",
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

  const getCandidateDetails = async (candidateId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/candidate/details/${candidateId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch candidate details.");
      }
      const data = await response.json();

      // Store the candidate's email in the state
      setEmailData((prevData) => ({
        ...prevData,
        candidateEmail: data.email,
      }));

      console.log(data);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      toast.error("Error fetching candidate details.");
    }
  };

  const deleteApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/applications_del/${applicationId}/`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw new Error("Failed to delete application.");
        }
        setApplications(applications.filter((app) => app.id !== applicationId));
        toast.success("Application deleted successfully.");
      } catch (error) {
        console.error("Error deleting application:", error);
        toast.error("Error deleting application.");
      }
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
    setEmailData({
      candidateEmail: "",
      message: "",
      jobId: "",
      candidateId: "",
      companyId: "",
    });
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
      toast.success(response.data.success || "Email sent successfully!");
      closeEmailModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light py-4">
      <ToastContainer
        className="toast-class text-light"
        position="top-center"
        autoClose={2000}
      />
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header text-dark">
              <h4 className="mb-0">Applications for your job posts</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {applications.length === 0 ? (
                    <div className="alert alert-info text-center" role="alert">
                      No applications found.
                    </div>
                  ) : (
                    <div className="list-group">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <h6 className="mb-1">
                              <strong>{app.candidate__full_name}</strong>
                            </h6>
                            <p className="mb-1">
                              Applied for <em>{app.job_title}</em> (Job ID:{" "}
                              {app.job_id}) on{" "}
                              {new Date(app.time).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                viewCandidateDetails(app.candidate_id)
                              }
                            >
                              View Details
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteApplication(app.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                getCandidateDetails(app.candidate_id);
                                openEmailModal(
                                  app.candidate__email,
                                  app.job_id,
                                  app.candidate_id,
                                  companyId
                                );
                              }}
                            >
                              Send Email
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <nav aria-label="Page navigation" className="mt-3">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          !hasPreviousPage ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={handlePreviousPage}
                          disabled={!hasPreviousPage}
                        >
                          Previous
                        </button>
                      </li>
                      <li className="page-item">
                        <span className="page-link">Page {currentPage}</span>
                      </li>
                      <li
                        className={`page-item ${
                          !hasNextPage ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={handleNextPage}
                          disabled={!hasNextPage}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEmailModal}
        className="send-email-modal modal-dialog modal-dialog-centered"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content send-email-modal-div">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Send Email</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={closeEmailModal}
            >
              X
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSendEmail}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
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
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData({ ...emailData, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    "Send Email"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationFeed;
