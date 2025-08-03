import { Row, Col, Card, Button } from "react-bootstrap";
import { FaRocket, FaHandshake, FaLightbulb, FaUsers } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./About.css";

function About() {
  const [showUpButton, setShowUpButton] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));
    const adminData = JSON.parse(sessionStorage.getItem("AdminData"));
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));
    if (companyData?.user_type === "company") {
      setUserType("company");
    } else if (adminData) {
      setUserType("admin");
    } else if (candidateData) {
      setUserType("candidate");
    } else {
      setUserType(null);
    }
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

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/leadership/section/"
      );
      setLeaders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaders:", error);
      setError("Failed to load leadership data");
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="main-about-div">
      <div className="about-hero">
        <Row className="align-items-center">
          <Col lg={12} className="text-center">
            <h1 className="about-title">About Career Connect</h1>
            <p className="about-subtitle">Connecting Talent with Opportunity</p>
          </Col>
        </Row>
      </div>

      <section className="about-section">
        <Row className="align-items-center mb-5">
          <Col lg={6}>
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              At Career Connect, we believe that finding the right job should be
              accessible, straightforward, and empowering. Our mission is to
              bridge the gap between talented professionals and innovative
              companies, creating meaningful connections that drive careers and
              businesses forward.
            </p>
            <p className="section-text">
              Founded in 2023, we&apos;ve helped thousands of job seekers find
              their dream positions and assisted companies in building
              exceptional teams that fuel growth and innovation.
            </p>
          </Col>
          <Col lg={6}>
            <div className="about-image-container">
              <img
                src="/assets/logo_nav.png"
                alt="Career Connect Team"
                className="about-image"
              />
            </div>
          </Col>
        </Row>

        <Row className="values-section">
          <Col lg={12} className="text-center mb-4">
            <h2 className="section-title">Our Core Values</h2>
          </Col>
          <Col md={3} sm={6}>
            <Card className="value-card">
              <Card.Body className="text-center">
                <div className="value-icon">
                  <FaRocket />
                </div>
                <Card.Title className="value-title">Innovation</Card.Title>
                <Card.Text>
                  We constantly evolve our platform to meet the changing needs
                  of the job market.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="value-card">
              <Card.Body className="text-center">
                <div className="value-icon">
                  <FaHandshake />
                </div>
                <Card.Title className="value-title">Integrity</Card.Title>
                <Card.Text>
                  We uphold the highest standards of honesty and transparency in
                  all our interactions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="value-card">
              <Card.Body className="text-center">
                <div className="value-icon">
                  <FaLightbulb />
                </div>
                <Card.Title className="value-title">Excellence</Card.Title>
                <Card.Text>
                  We strive for excellence in our service, technology, and user
                  experience.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="value-card">
              <Card.Body className="text-center">
                <div className="value-icon">
                  <FaUsers />
                </div>
                <Card.Title className="value-title">Community</Card.Title>
                <Card.Text>
                  We foster a supportive environment for both job seekers and
                  employers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="stats-section my-5">
          <Col md={3} sm={6} className="text-center">
            <div className="stat-item">
              <h3 className="stat-number">15,000+</h3>
              <p className="stat-label">Job Placements</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="text-center">
            <div className="stat-item">
              <h3 className="stat-number">5,000+</h3>
              <p className="stat-label">Company Partners</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="text-center">
            <div className="stat-item">
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Satisfaction Rate</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="text-center">
            <div className="stat-item">
              <h3 className="stat-number">25+</h3>
              <p className="stat-label">Industries Served</p>
            </div>
          </Col>
        </Row>

        <Row className="team-section mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="section-title">Our Leadership Team</h2>
          </Col>
          {loading ? (
            [...Array(4)].map((_, index) => (
              <Col lg={3} md={6} key={index}>
                <Card className="team-card">
                  <div className="team-image-container placeholder-glow">
                    <div
                      className="placeholder"
                      style={{ height: "200px" }}
                    ></div>
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="placeholder-glow">
                      <span className="placeholder col-6"></span>
                    </Card.Title>
                    <Card.Subtitle className="placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </Card.Subtitle>
                    <Card.Text className="placeholder-glow">
                      <span className="placeholder col-7"></span>
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-4"></span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : error ? (
            <Col lg={12} className="text-center">
              <p className="text-danger">{error}</p>
            </Col>
          ) : (
            leaders.map((leader) => (
              <Col lg={3} md={6} key={leader.id}>
                <Card className="team-card">
                  <div className="team-image-container">
                    <img
                      src={`http://127.0.0.1:8000${leader.image}`}
                      alt={leader.name}
                      className="team-image"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="team-name">{leader.name}</Card.Title>
                    <Card.Subtitle className="team-position">
                      {leader.position}
                    </Card.Subtitle>
                    <Card.Text className="team-bio">
                      {leader.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        <Row className="cta-section text-center my-5">
          <Col lg={8} className="mx-auto">
            <h2 className="section-title">
              Ready to Find Your Next Opportunity?
            </h2>
            <p className="section-text mb-4">
              Join thousands of professionals who have found their dream jobs
              through Career Connect.
            </p>
            <div className="cta-buttons">
              <Button
                as={Link}
                to="/job-feed"
                variant="primary"
                size="lg"
                className="me-3 cta-button"
              >
                Browse Jobs
              </Button>
              {userType === "admin" ? (
                <Button
                  as={Link}
                  to="/admin/dashboard"
                  variant="outline-primary"
                  size="lg"
                  className="cta-button"
                >
                  Admin
                </Button>
              ) : userType === "company" ? (
                <Button
                  as={Link}
                  to="/company/dashboard"
                  variant="outline-primary"
                  size="lg"
                  className="cta-button"
                >
                  Dashboard
                </Button>
              ) : userType === "candidate" ? (
                <Button
                  as={Link}
                  to="/dashboard"
                  variant="outline-primary"
                  size="lg"
                  className="cta-button"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/company-signin"
                  variant="outline-primary"
                  size="lg"
                  className="cta-button"
                >
                  For Employers
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </section>

      {showUpButton && (
        <button className="up-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default About;
