import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { Link } from "react-router-dom";

const NavbarComponent = () => {
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
        }} // Added position and z-index
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
              <NavDropdown title="More" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/action">
                  Action
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/another-action">
                  Another Action
                </NavDropdown.Item>
              </NavDropdown>
              <Button
                as={Link}
                to="/signin"
                variant="outline-light"
                className="ms-2"
              >
                Signin
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
