/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, Container, Spinner } from "react-bootstrap";
import {
  FaArrowLeft,
  FaBuilding,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhone,
  FaInfoCircle,
  FaBriefcase,
  FaFileAlt,
  FaTags,
  FaDollarSign,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import "./AppliedJobDetails.css";

function AppliedJobDetails() {
  const { jobId, companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([getCompanyDetails(), getJobDetails()]);
      } catch (error) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, companyId]);

  const getJobDetails = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get/job/details/${jobId}/`
      );
      setJobData(response.data);
    } catch (error) {
      console.error("Error fetching job data:", error);
      throw error;
    }
  };

  const getCompanyDetails = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get/company/details/${companyId}/`
      );
      setCompanyData(response.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
      throw error;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading details...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger">
          <FaInfoCircle className="me-2" />
          {error}
        </div>
        <Button variant="outline-primary" onClick={handleGoBack}>
          <FaArrowLeft className="me-2" /> Go Back
        </Button>
      </Container>
    );
  }

  return (
    <div className="applied-job-details-main-div p-4">
      <Container className="applied-job-details-container">
        <Button
          variant="outline-primary"
          className="mb-4"
          onClick={handleGoBack}
        >
          <FaArrowLeft className="me-2" /> Back to Jobs
        </Button>

        <Row className="g-4">
          {/* Job Details Section */}
          <Col lg={7} md={12}>
            {jobData ? (
              <div className="job-details-section">
                <div className="section-header">
                  <h4 className="mb-0">
                    <FaBriefcase className="me-2" /> Job Details
                  </h4>
                </div>
                <div className="section-body">
                  <h5 className="job-title">{jobData.title}</h5>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="job-badge location-badge">
                      <FaMapMarkerAlt className="me-1" /> {jobData.job_location}
                    </span>
                    <span className="job-badge salary-badge">
                      <FaDollarSign className="me-1" /> {jobData.salary_range}
                    </span>
                    <span className="job-badge time-badge">
                      <FaClock className="me-1" /> {jobData.job_time}
                    </span>
                    <span className="job-badge type-badge">
                      <FaBriefcase className="me-1" /> {jobData.job_type}
                    </span>
                  </div>
                  <hr />
                  <div className="mb-4">
                    <h6>
                      <FaFileAlt className="me-2 text-secondary" />
                      Description
                    </h6>
                    <p className="job-description">{jobData.description}</p>
                  </div>

                  <div className="mb-3">
                    <h6>
                      <FaTags className="me-2 text-secondary" />
                      Requirements
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {jobData.tags.split(",").map((tag, index) => (
                        <span className="skill-tag" key={index}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <hr />
                  <div className="posted-date">
                    <FaCalendarAlt className="me-2" />
                    <small>
                      Posted on:{" "}
                      {new Date(jobData.posted_at).toLocaleDateString("en-GB")}
                    </small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-section text-center">
                <p>No job information available</p>
              </div>
            )}
          </Col>

          {/* Company Details Section */}
          <Col lg={5} md={12}>
            {companyData ? (
              <div className="company-details-section">
                <div className="section-header">
                  <h4 className="mb-0">
                    <FaBuilding className="me-2" /> Company Details
                  </h4>
                </div>
                <div className="section-body">
                  <h5 className="company-name">{companyData.name}</h5>
                  <hr />
                  <div className="company-info">
                    <p>
                      <FaEnvelope className="me-2 text-secondary" />
                      <strong className="me-2">Email:</strong>{" "}
                      {companyData.email}
                    </p>
                    <p>
                      <FaMapMarkerAlt className="me-2 text-secondary" />
                      <strong className="me-2">Location:</strong>{" "}
                      {companyData.location}
                    </p>
                    <p>
                      <FaPhone className="me-2 text-secondary" />
                      <strong className="me-2">Phone:</strong>{" "}
                      {companyData.phone_number}
                    </p>
                    <p>
                      <FaGlobe className="me-2 text-secondary" />
                      <strong className="me-2">Website:</strong>{" "}
                      <a
                        href={companyData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {companyData.website}
                      </a>
                    </p>
                  </div>
                  <hr />
                  <div>
                    <h6>
                      <FaInfoCircle className="me-2 text-secondary" />
                      About
                    </h6>
                    <p className="company-description">
                      {companyData.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-section text-center">
                <p>No company information available</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AppliedJobDetails;
