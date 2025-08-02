/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Link,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components for enhanced visual appeal
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    maxWidth: 700,
    width: "90%",
    margin: 16,
    overflow: "visible",
    boxShadow:
      "0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  position: "relative",
  textAlign: "center",
  "& .MuiTypography-root": {
    fontWeight: 600,
    fontSize: "1.5rem",
    paddingRight: theme.spacing(6),
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.primary.contrastText,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 8,
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(2),
  flexShrink: 0,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  minHeight: 200,
}));

const Details = ({ companyId, showModal, handleClose }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (companyId && showModal) {
      fetchCompanyDetails();
    }
  }, [companyId, showModal]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/all/company/${companyId}/details/`
      );
      setCompany(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load company details. Please try again.");
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "Not available";
    return phone;
  };

  const getCompanyTypeColor = (type) => {
    const typeColors = {
      startup: "success",
      enterprise: "primary",
      sme: "warning",
      corporation: "info",
      default: "default",
    };
    return typeColors[type?.toLowerCase()] || typeColors.default;
  };

  return (
    <StyledDialog
      open={showModal}
      onClose={handleClose}
      maxWidth="md"
      fullScreen={isMobile}
    >
      <StyledDialogTitle>
        <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        {company ? company.name : "Company Details"}
        <CloseButton onClick={handleClose} size="small">
          <CloseIcon />
        </CloseButton>
      </StyledDialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        {loading ? (
          <LoadingContainer>
            <CircularProgress size={60} thickness={4} />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: 2, fontWeight: 500 }}
            >
              Loading company details...
            </Typography>
          </LoadingContainer>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              sx={{ borderRadius: 2 }}
              action={
                <IconButton
                  aria-label="retry"
                  color="inherit"
                  size="small"
                  onClick={fetchCompanyDetails}
                >
                  <DescriptionIcon />
                </IconButton>
              }
            >
              {error}
            </Alert>
          </Box>
        ) : company ? (
          <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    {company.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {company.location}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ textAlign: { xs: "left", sm: "right" } }}
                >
                  <Chip
                    label={company.company_type || "Company"}
                    color={getCompanyTypeColor(company.company_type)}
                    size="large"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      px: 2,
                      py: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Company Details Grid */}
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <InfoCard>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", mb: 3 }}
                    >
                      <PhoneIcon sx={{ mr: 1 }} />
                      Contact Information
                    </Typography>

                    {company.website && (
                      <InfoItem>
                        <IconWrapper>
                          <WebsiteIcon fontSize="small" />
                        </IconWrapper>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Website
                          </Typography>
                          <Link
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary"
                            sx={{
                              fontWeight: 500,
                              textDecoration: "none",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            Visit Website
                          </Link>
                        </Box>
                      </InfoItem>
                    )}

                    <InfoItem>
                      <IconWrapper>
                        <PhoneIcon fontSize="small" />
                      </IconWrapper>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {formatPhoneNumber(company.phone_number)}
                        </Typography>
                      </Box>
                    </InfoItem>

                    <InfoItem>
                      <IconWrapper>
                        <PersonIcon fontSize="small" />
                      </IconWrapper>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          CEO Phone
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {formatPhoneNumber(company.ceo_phone)}
                        </Typography>
                      </Box>
                    </InfoItem>
                  </CardContent>
                </InfoCard>
              </Grid>

              {/* Company Information */}
              <Grid item xs={12} md={6}>
                <InfoCard>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", mb: 3 }}
                    >
                      <CategoryIcon sx={{ mr: 1 }} />
                      Company Information
                    </Typography>

                    <InfoItem>
                      <IconWrapper>
                        <BusinessIcon fontSize="small" />
                      </IconWrapper>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Company Type
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {company.company_type || "Not specified"}
                        </Typography>
                      </Box>
                    </InfoItem>
                  </CardContent>
                </InfoCard>
              </Grid>

              {/* Description */}
              {company.description && (
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <DescriptionIcon sx={{ mr: 1 }} />
                        About the Company
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                          color: "text.secondary",
                        }}
                      >
                        {company.description}
                      </Typography>
                    </CardContent>
                  </InfoCard>
                </Grid>
              )}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="h6">Company not found</Typography>
              <Typography>
                The requested company details could not be retrieved.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default Details;
