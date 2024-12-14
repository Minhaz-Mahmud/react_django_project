/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./Details.css";

const Details = ({ companyId, showModal, handleClose }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/all/company/${companyId}/details/`
      );
      setCompany(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load company details.");
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size="lg"
      className="custom-modal"
    >
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title className="text-center">
          {company ? company.name : "Company Details"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading company details...</p>
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : company ? (
          <div className="company-details">
            <h4>
              <span className="highlight">Location:</span> {company.location}
            </h4>
            <br />
            {company.website && (
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  Visit Website
                </a>
              </p>
            )}
            <p>
              <strong>Phone:</strong> {company.phone_number}
            </p>
            <p>
              <strong>CEO Phone:</strong> {company.ceo_phone}
            </p>
            <p>
              <strong>Company Type:</strong> {company.company_type}
            </p>
            <p>
              <strong>Description:</strong> {company.description}
            </p>
          </div>
        ) : (
          <p>Company not found.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Details;
