/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Badge, Row, Col, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faTools,
  faDownload,
  faEye,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./CandidateDetails.css";

const CandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/candidates/${candidateId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch candidate details.");
      }
      const data = await response.json();
      setCandidateDetails(data);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultProfilePicture = "profile.jpg";

  const profileImage = candidateDetails?.profile_picture
    ? `http://localhost:8000${candidateDetails.profile_picture}`
    : defaultProfilePicture;
  const resumeLink = candidateDetails?.resume
    ? `http://localhost:8000${candidateDetails.resume}`
    : null;

  const handleShowResumeModal = () => setShowResumeModal(true);
  const handleCloseResumeModal = () => setShowResumeModal(false);

  // Function to get file extension
  const getFileExtension = (filename) => {
    if (!filename) return "";
    return filename.split(".").pop().toLowerCase();
  };

  // Check if the resume is a PDF
  const resumeExtension = resumeLink ? getFileExtension(resumeLink) : "";
  const isPdf = resumeExtension === "pdf";

  return (
    <div className="candidate-details-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white p-3">
              <h3 className="mb-0">Candidate Profile</h3>
            </div>

            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading candidate information...</p>
              </div>
            ) : !candidateDetails ? (
              <div className="card-body text-center">
                <div className="alert alert-warning">
                  <h5>No candidate details found</h5>
                  <p>The requested candidate information could not be found.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="card-body p-4">
                  <Row>
                    <Col md={4} className="text-center mb-4 mb-md-0">
                      <div
                        className="profile-image mx-auto mb-3"
                        style={{
                          width: "180px",
                          height: "180px",
                          borderRadius: "50%",
                          backgroundImage: `url(${profileImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: "5px solid #f8f9fa",
                          boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                        }}
                      ></div>
                      {resumeLink && (
                        <div className="mt-3">
                          <Button
                            variant="outline-primary"
                            onClick={handleShowResumeModal}
                            className="mb-2 w-100"
                            disabled={!isPdf}
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            Preview Resume
                          </Button>
                          <a
                            href={resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary w-100"
                            download
                          >
                            <FontAwesomeIcon
                              icon={faDownload}
                              className="me-2"
                            />
                            Download Resume
                          </a>
                          {!isPdf && (
                            <div className="mt-2 text-muted small">
                              <em>Preview only available for PDF files</em>
                            </div>
                          )}
                        </div>
                      )}
                    </Col>
                    <Col md={8}>
                      <h2 className="mb-3">{candidateDetails.full_name}</h2>
                      <hr />
                      <Row className="mb-3">
                        <Col xs={12}>
                          <div className="info-item">
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              className="text-primary me-2"
                            />
                            <strong>Email:</strong> {candidateDetails.email}
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={12}>
                          <div className="info-item">
                            <FontAwesomeIcon
                              icon={faPhone}
                              className="text-primary me-2"
                            />
                            <strong>Phone:</strong>{" "}
                            {candidateDetails.phone_number}
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={12}>
                          <div className="info-item">
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="text-primary me-2"
                            />
                            <strong>Location:</strong>{" "}
                            {candidateDetails.location}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <div className="info-item">
                            <FontAwesomeIcon
                              icon={faTools}
                              className="text-primary me-2"
                            />
                            <strong>Skills:</strong>
                          </div>
                          <div className="mt-2">
                            {candidateDetails.skills.map((skill, index) => (
                              <Badge
                                bg="light"
                                text="dark"
                                className="me-2 mb-2 p-2"
                                key={index}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>

      {/* Resume Preview Modal */}
      <Modal
        show={showResumeModal}
        onHide={handleCloseResumeModal}
        size="xl"
        centered
      >
        <Modal.Header className="bg-light">
          <Modal.Title className="text-dark">Resume Preview</Modal.Title>
          <Button
            variant="link"
            className="close-button p-0 ms-auto"
            onClick={handleCloseResumeModal}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="pdf-container">
            <object
              data={resumeLink}
              type="application/pdf"
              width="100%"
              height="750px"
              className="pdf-viewer"
            >
              <div className="pdf-fallback text-center p-5">
                <p>It appears your browser doesn&apos;t support embedded PDFs.</p>
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  Download Resume
                </a>
              </div>
            </object>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseResumeModal}>
            Close
          </Button>
          <a
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            download
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Download
          </a>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CandidateDetails;
