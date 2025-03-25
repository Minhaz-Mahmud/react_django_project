/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { useState } from "react";
import "./footer.css";

const FooterComponent = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

    if (companyData?.user_type === "company") {
      setUserType("company");
    } else if (candidateData) {
      setUserType("candidate");
    } else {
      setUserType(null);
    }
  }, []);

  return (
    <footer>
      {/* Main Footer */}
      <div className="footer-main py-6">
        <Row className="gy-4">
          <Col lg={3} md={6}>
            <div className="footer-info">
              <h3 className="footer-logo mb-4">Career Connect</h3>
              <p className="footer-description">
                We are a leading company in providing exclusive jobs and
                candidates to our users worldwide.
              </p>
              <div className="social-links mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://twitter.com"
                  aria-label="Twitter"
                  target="_blank"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  target="_blank"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://linkedin.com"
                  aria-label="LinkedIn"
                  target="_blank"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h4 className="footer-heading">Useful Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>

              {userType === "company" ? (
                <li>
                  <Link to="/company/dashboard">Dashboard</Link>
                </li>
              ) : userType === "candidate" ? (
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              ) : (
                <li>
                  <Link to="/company-signin">Company Login</Link>
                </li>
              )}
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h4 className="footer-heading">We Provide</h4>
            <ul className="footer-links">
              <li>
                <a href="https://developer.android.com/" target="_blank">
                  App Development
                </a>
              </li>
              <li>
                <a
                  href="https://www.geeksforgeeks.org/web-development/"
                  target="_blank"
                >
                  Web Development
                </a>
              </li>
              <li>
                <a
                  href="https://brainstation.io/career-guides/what-is-a-machine-learning-engineer"
                  target="_blank"
                >
                  ML Engineering
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Computer_security"
                  target="_blank"
                >
                  Cyber Security
                </a>
              </li>
              <li>
                <a
                  href="https://www.intel.com/content/www/us/en/cloud-computing/devops.html"
                  target="_blank"
                >
                  Cloud Engineering
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h4 className="footer-heading">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="icon" />
                <p>
                  123 Banani Street, Suite 100
                  <br />
                  Dhaka, DHK 1219
                </p>
              </div>
              <div className="contact-item">
                <FaPhone className="icon" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="contact-item">
                <FaEnvelope className="icon" />
                <p>info@cc.com</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Newsletter Section */}
      <div className="footer-newsletter py-4">
        <Row className="justify-content-center">
          <Col lg={6}>
            <h4 className="text-center mb-3">Subscribe to Our Newsletter</h4>
            <div className="newsletter-form d-flex">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
              <Button type="submit" className="btn-subscribe">
                Subscribe
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom py-3">
        <Row>
          <Col className="text-center">
            <p className="copyright-text mb-0">
              &copy; {new Date().getFullYear()} <strong>Career Connect</strong>.
              All Rights Reserved
            </p>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default FooterComponent;
