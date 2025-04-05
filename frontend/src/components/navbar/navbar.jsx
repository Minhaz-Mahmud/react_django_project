/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NavbarComponent = () => {
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");
  const [showNavbar, setShowNavbar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

    if (companyData?.user_type === "company") {
      setUserType("company");
      setUserName(companyData.name);
    } else if (candidateData) {
      setUserType("candidate");
      setUserName(candidateData.full_name);
    } else {
      setUserType(null);
      setUserName("");
    }
  }, [location]);

  // navbar scroll show hide functions start

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > lastScrollY && scrollY > 100) {
      setShowNavbar(true); // Show navbar when scrolling down
    } else if (scrollY < 50) {
      setShowNavbar(false); // Hide when at the top
    }
    setLastScrollY(scrollY);
  };

  const handleMouseMove = (e) => {
    if (e.clientY < 50) {
      setShowNavbar(true); // Show navbar if cursor is near the top
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  // navbar scroll show hide functions ends

  const handleLogout = () => {
    sessionStorage.removeItem("companyData");
    sessionStorage.removeItem("candidateData");
    sessionStorage.removeItem("firstRefresh");
    setUserType(null);
    setUserName("");
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className={`navbar-class ${showNavbar ? "visible" : "hidden"}`}
      fixed="top"
    >
      <Navbar.Brand as={Link} to="/">
        <img src="/assets/logo_nav.png" alt="Logo" className="navbar-logo" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse
        id="basic-navbar-nav"
        className="basic-navbar-nav-collapse"
      >
        <Nav className="ms-auto">
          <Nav.Link
            as={Link}
            to="/job-feed"
            className={location.pathname === "/job-feed" ? "active" : ""}
          >
            Find Jobs
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/all/company"
            className={location.pathname === "/all/company" ? "active" : ""}
          >
            Companies
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
          >
            About
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/CO"
            className={location.pathname === "/CO" ? "active" : ""}
          >
             Job_Suggestions
          </Nav.Link>

          {userType ? (
            <NavDropdown
              title={userName}
              id="basic-nav-dropdown"
              className="user-nav-dropdown"
            >
              {userType === "company" ? (
                <NavDropdown.Item as={Link} to="/company/dashboard">
                  Dashboard
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item as={Link} to="/dashboard">
                  Dashboard
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
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
    </Navbar>
  );
};

export default NavbarComponent;
