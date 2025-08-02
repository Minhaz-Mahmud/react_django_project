/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import Details from "./Details";
import "./AllCompany.css";
import CompanyMapModal from "../company_maps/CompanyMapModal";
// MUI imports
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Pagination,
  CircularProgress,
  Fab,
  Alert,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { KeyboardArrowUp, LocationOn, Info } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  marginTop: "80px",
  height: "400px",
  width: "100%",
  backgroundImage: `url("https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  marginBottom: "40px",
  [theme.breakpoints.down("md")]: {
    height: "350px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "300px",
  },
}));

const HeroOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
}));

const CompanyCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
}));

const ScrollToTopButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

const AllCompany = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companyLocation, setCompanyLocation] = useState(null);
  const [hasSession, setHasSession] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;

  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    type: "",
  });

  // Scroll button state
  const [showUpButton, setShowUpButton] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchCompanies();
    checkSessionData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, companies]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/all/company/list/"
      );
      console.log("Company data fetched:", response.data);
      setCompanies(response.data);
      setFilteredCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load company data.", err);
      setLoading(false);
    }
  };

  const checkSessionData = () => {
    const candidateData = sessionStorage.getItem("candidateData");
    const companyData = sessionStorage.getItem("companyData");
    setHasSession(candidateData || companyData ? true : false);
  };

  const applyFilters = () => {
    const filtered = companies.filter((company) => {
      return (
        (filters.location === "" ||
          company.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (filters.type === "" ||
          company.company_type
            .toLowerCase()
            .includes(filters.type.toLowerCase()))
      );
    });
    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleShowDetails = (companyId) => {
    setSelectedCompanyId(companyId);
    setShowDetailsModal(true);
    setShowMapModal(false);
  };

  const handleLocationClick = async (companyId) => {
    try {
      // Find the company name
      const selectedCompany = companies.find(
        (company) => company.id === companyId
      );
      const companyName = selectedCompany
        ? selectedCompany.name
        : "Unknown Company";

      const response = await axios.get(
        `http://127.0.0.1:8000/api/company/location/${companyId}/`
      );
      setCompanyLocation(response.data);
      setSelectedCompanyName(companyName); // Store the company name
      setShowMapModal(true);
      setShowDetailsModal(false);
    } catch (error) {
      setError("Failed to fetch location.", error);
    }
  };

  const handleClose = () => {
    setShowDetailsModal(false);
    setShowMapModal(false);
  };

  // Pagination logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: alpha(theme.palette.grey[500], 0.1),
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <HeroSection>
        <HeroOverlay>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 2,
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
            }}
          >
            Find the Best Companies for Your Career
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              maxWidth: 700,
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
            }}
          >
            Browse through top companies and explore career opportunities
          </Typography>
        </HeroOverlay>
      </HeroSection>

      <Container maxWidth="xl" sx={{ mb: 8 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "fit-content",
                position: { md: "sticky" },
                top: { md: 100 },
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  fontWeight: 600,
                }}
              >
                Filter Companies
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Location</InputLabel>
                  <Select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    label="Location"
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    <MenuItem value="Dhaka">Dhaka</MenuItem>
                    <MenuItem value="Khulna">Khulna</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Company Type</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    label="Company Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Multinational">Multinational</MenuItem>
                    <MenuItem value="Startup">Startup</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              sx={{
                mb: 4,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Explore Companies
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : currentCompanies.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {currentCompanies.map((company) => (
                  <CompanyCard key={company.id} elevation={3}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={hasSession ? 8 : 12}>
                          <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{
                              color: theme.palette.primary.dark,
                              fontWeight: 500,
                            }}
                          >
                            {company.name}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <LocationOn fontSize="small" color="action" />
                            <strong>Location:</strong> {company.location}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Type:</strong> {company.company_type}
                          </Typography>
                        </Grid>

                        {hasSession && (
                          <Grid item xs={12} sm={4}>
                            <CardActions
                              sx={{
                                display: "flex",
                                flexDirection: isTablet ? "row" : "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                                height: "100%",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Info />}
                                fullWidth
                                onClick={() => handleShowDetails(company.id)}
                              >
                                Details
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<LocationOn />}
                                fullWidth
                                onClick={() => handleLocationClick(company.id)}
                              >
                                Location
                              </Button>
                            </CardActions>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </CompanyCard>
                ))}
              </Box>
            ) : (
              <Alert severity="info">
                No companies match the filter criteria.
              </Alert>
            )}

            {/* Pagination */}
            {filteredCompanies.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Pagination
                  count={Math.ceil(filteredCompanies.length / companiesPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Modals */}
      <Details
        companyId={selectedCompanyId}
        showModal={showDetailsModal}
        handleClose={handleClose}
      />

      {showMapModal && companyLocation && (
        <CompanyMapModal
          companyLocation={companyLocation}
          handleClose={handleClose}
          companyName={selectedCompanyName} // Use the stored company name
        />
      )}``

      {/* Scroll to top button */}
      {showUpButton && (
        <ScrollToTopButton
          color="primary"
          size="small"
          aria-label="scroll back to top"
          onClick={scrollToTop}
        >
          <KeyboardArrowUp />
        </ScrollToTopButton>
      )}
    </Box>
  );
};

export default AllCompany;
