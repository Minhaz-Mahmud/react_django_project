import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  Chip,
  MenuItem,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
  LinearProgress,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SearchIcon from "@mui/icons-material/Search";
import "../signin/Signin.css";

const careerLevels = ["Entry Level", "Mid Level", "Senior Level"];
const jobTypes = ["Remote", "On-site", "Hybrid"];

const CareerOpportunities = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    skills: "",
    degree: "",
    experience: "",
    jobType: "",
    location: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const onFindJobs = async () => {
    if (Object.values(formData).some((value) => !value)) {
      toast.error("Please fill all details");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/find-jobs/",
        formData
      );
      if (response.status === 200) {
        toast.success("Job suggestions found!");
        navigate("/job-results", { state: { jobs: response.data.jobs } });
      }
    } catch (error) {
      toast.error("Failed to find job suggestions");
      console.error("Error finding jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "url('/assets/login-reg-bg.jpg') no-repeat center center",
        backgroundSize: "cover",
        pt: 10,
        pb: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(3px)",
          zIndex: 1,
        },
      }}
    >
      <ToastContainer />
      <Container maxWidth="sm" sx={{ mt: 5, position: "relative", zIndex: 2 }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            backgroundColor: alpha("#ffffff", 0.9),
            backdropFilter: "blur(10px)",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Progress Bar */}
          <Fade in={loading} timeout={300}>
            <Box sx={{ width: "100%", position: "absolute", top: 0, left: 0 }}>
              <LinearProgress
                color="primary"
                sx={{
                  height: 4,
                  "& .MuiLinearProgress-bar": {
                    transition: "transform 0.4s linear",
                  },
                }}
              />
            </Box>
          </Fade>

          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: "black",
                fontSize: isMobile ? "1.5rem" : "2rem",
              }}
            >
              <WorkOutlineIcon fontSize="large" />
              Career Opportunities
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Find job opportunities based on your skills and qualifications
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                component="label"
                htmlFor="skills"
                sx={{
                  display: "block",
                  mb: 1,
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Skills
              </Typography>
              <TextField
                id="skills"
                fullWidth
                variant="outlined"
                placeholder="e.g. Python, React"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundColor: theme.palette.background.paper,
                    },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                component="label"
                htmlFor="degree"
                sx={{
                  display: "block",
                  mb: 1,
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Degree
              </Typography>
              <TextField
                id="degree"
                fullWidth
                variant="outlined"
                placeholder="e.g. B.Sc. in Computer Science"
                value={formData.degree}
                onChange={(e) => handleInputChange("degree", e.target.value)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundColor: theme.palette.background.paper,
                    },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                component="label"
                htmlFor="experience"
                sx={{
                  display: "block",
                  mb: 1,
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Experience Level
              </Typography>
              <TextField
                id="experience"
                select
                fullWidth
                variant="outlined"
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundColor: theme.palette.background.paper,
                    },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
              >
                {careerLevels.map((level, index) => (
                  <MenuItem key={index} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{
                  display: "block",
                  mb: 2,
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Preferred Job Type
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {jobTypes.map((type, index) => (
                  <Chip
                    key={index}
                    label={type}
                    onClick={() =>
                      !loading && handleInputChange("jobType", type)
                    }
                    color={formData.jobType === type ? "primary" : "default"}
                    variant={formData.jobType === type ? "filled" : "outlined"}
                    disabled={loading}
                    sx={{
                      px: 1,
                      fontSize: "0.9rem",
                      transition: "all 0.2s",
                      cursor: loading ? "default" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      "&:hover": {
                        backgroundColor: !loading
                          ? formData.jobType === type
                            ? theme.palette.primary.main
                            : theme.palette.action.hover
                          : undefined,
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                component="label"
                htmlFor="location"
                sx={{
                  display: "block",
                  mb: 1,
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Location
              </Typography>
              <TextField
                id="location"
                fullWidth
                variant="outlined"
                placeholder="e.g. New York, USA"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundColor: theme.palette.background.paper,
                    },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={onFindJobs}
              startIcon={<SearchIcon />}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: 2,
                position: "relative",
                transition: "all 0.3s",
                opacity: loading ? 0.85 : 1,
                "&:hover": {
                  transform: loading ? "none" : "translateY(-2px)",
                  boxShadow: loading ? 2 : 4,
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {loading ? "Searching..." : "Find Jobs"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CareerOpportunities;
