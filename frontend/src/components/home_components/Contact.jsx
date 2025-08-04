/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import axios from "axios";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpButton, setShowUpButton] = useState(false);
  const [faqs, setFaqs] = useState([]);

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

  // Add useEffect to fetch location
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/faq/section/"
      );
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.name && formData.email && formData.message) {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/contact-email/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setSubmitted(true);
          setError(false);
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="main-contact-div">
      <div className="contact-hero">
        <Row>
          <Col md={6}>
            <img
              src="/assets/logo_nav.png"
              alt="Logo"
              className="contact-hero-logo py-1"
              width={"80%"}
            />
          </Col>
          <Col md={6} className="text-center">
            <h1 className="py-4 contact-title">Get in Touch</h1>
            <p className="contact-subtitle">We&apos;d love to hear from you</p>
          </Col>
        </Row>
      </div>

      <section className="contact-content">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="contact-container">
              <Row className="g-0">
                <Col md={5} className="contact-info-section">
                  <div className="contact-info-content">
                    <h2 className="info-title text-light">
                      Contact Information
                    </h2>
                    <p className="info-subtitle">
                      Reach out and we&apos;ll get back to you within 24 hours
                    </p>

                    <div className="contact-info-items">
                      <div className="contact-info-item">
                        <div className="contact-icon">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="contact-text">
                          <h3 className="text-light">Our Location</h3>
                          <p>
                            1234 Career Avenue, Tech District
                            <br />
                            San Francisco, CA 94105
                          </p>
                        </div>
                      </div>

                      <div className="contact-info-item">
                        <div className="contact-icon">
                          <FaPhoneAlt />
                        </div>
                        <div className="contact-text">
                          <h3 className="text-light">Phone Number</h3>
                          <p>+1 (555) 123-4567</p>
                        </div>
                      </div>

                      <div className="contact-info-item">
                        <div className="contact-icon">
                          <FaEnvelope />
                        </div>
                        <div className="contact-text">
                          <h3 className="text-light">Email Address</h3>
                          <p>support@careerconnect.com</p>
                        </div>
                      </div>

                      <div className="contact-info-item">
                        <div className="contact-icon">
                          <FaClock />
                        </div>
                        <div className="contact-text">
                          <h3 className="text-light">Working Hours</h3>
                          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                    </div>

                    <div className="social-links">
                      <a
                        href="https://www.linkedin.com/feed/"
                        target="_blank"
                        className="social-link"
                      >
                        <FaLinkedin />
                      </a>
                      <a
                        href="https://x.com/?lang=en"
                        target="_blank"
                        className="social-link"
                      >
                        <FaTwitter />
                      </a>
                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        className="social-link"
                      >
                        <FaInstagram />
                      </a>
                    </div>
                  </div>
                </Col>

                <Col md={7} className="contact-form-section">
                  <div className="contact-form-content">
                    <h2 className="form-title">Send Us a Message</h2>

                    {submitted && (
                      <Alert
                        variant="success"
                        className="mb-4"
                        onClose={() => setSubmitted(false)}
                        dismissible
                      >
                        Thank you for your message! We&apos;ll get back to you
                        shortly.
                      </Alert>
                    )}

                    {error && (
                      <Alert
                        variant="danger"
                        className="mb-4"
                        onClose={() => setError(false)}
                        dismissible
                      >
                        Please fill out all required fields.
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="contact-input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          className="contact-input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                          className="contact-input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help you"
                          className="contact-input"
                          rows={4}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </section>

      <div className="faq-section">
        <section>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Find quick answers to common questions
              </p>
            </Col>
          </Row>

          <Row className="m-5">
            {faqs.map((faq) => (
              <Col md={6} key={faq.id}>
                <div className="faq-item">
                  <h3>{faq.title}</h3>
                  <p>{faq.description}</p>
                </div>
              </Col>
            ))}
            {faqs.length === 0 && (
              <Col className="text-center">
                <p>No FAQs available at the moment.</p>
              </Col>
            )}
          </Row>
        </section>
      </div>

      {showUpButton && (
        <button className="up-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default Contact;
