/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const CompanySessionData = JSON.parse(
      sessionStorage.getItem("companyData")
    );
    if (CompanySessionData && CompanySessionData.user_type === "company")
      setUserType("company");
    else setUserType(null);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("companyData");
    sessionStorage.removeItem("firstRefresh");
    setUserType(null);
    navigate("/");
  };

  return (
    <div>
      <Navbar
        className="rounded navbar-class"
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
        <Container>
          <Navbar.Brand as={Link} to="/">
            Career Connect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto mobile-nav-bg">
              <Nav.Link as={Link} to="/find-jobs">
                Find Jobs
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>

              {/* Show different items if the user is logged in as a company */}
              {userType === "company" ? (
                <>
                  <Nav.Link as={Link} to="/company/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/post-jobs">
                    Post Jobs
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    className="ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
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
      <br />
    </div>
  );
};

export default NavbarComponent;
