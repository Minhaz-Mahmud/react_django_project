/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NavbarComponent = () => {
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // To track navigation changes
  const CompanySessionData = JSON.parse(sessionStorage.getItem("companyData"));
  const CandidateSessionData = JSON.parse(
    sessionStorage.getItem("candidateData")
  );

  useEffect(() => {
    // Function to check and update the user data from sessionStorage
    const updateUserData = () => {
      if (CompanySessionData && CompanySessionData.user_type === "company") {
        setUserType("company");
        setUserName(CompanySessionData.name);
      } else if (CandidateSessionData) {
        setUserType("candidate");
        setUserName(CandidateSessionData.full_name);
      } else {
        setUserType(null);
        setUserName("");
      }
    };

    updateUserData(); // Initial check for user data
  }, [location]); // Re-run the effect whenever the location changes (i.e., page navigation)

  const handleLogout = () => {
    if (userType === "company") {
      sessionStorage.removeItem("companyData");
    } else if (userType === "candidate") {
      sessionStorage.removeItem("candidateData");
    }
    sessionStorage.removeItem("firstRefresh");
    setUserType(null);
    setUserName("");
    navigate("/"); 
  };

  return (
    <div>
      <Navbar
        className="text-dark rounded navbar-class"
        bg="dark"
        variant="dark"
        expand="lg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Container className="bg-dark">
          <Navbar.Brand as={Link} to="/">
            Career Connect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto mobile-nav-bg">
              <Nav.Link as={Link} to="/job-feed">
                Find Jobs
              </Nav.Link>
              <Nav.Link as={Link} to="/all/company">
                Companies
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>

              {/* Show different items based on logged-in user type */}
              {userType === "company" ? (
                <>
                  <NavDropdown
                    className="user-company-navdropdown"
                    title={userName}
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/company/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : userType === "candidate" ? (
                <>
                  <NavDropdown
                    className="user-company-navdropdown"
                    title={userName}
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/candidate/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/signin"
                  variant="outline-light"
                  className="ms-2"
                >
                  Signin
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
