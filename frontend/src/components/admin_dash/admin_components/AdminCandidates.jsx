import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Box,
  CircularProgress,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  ErrorOutline as ErrorOutlineIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Cake as CakeIcon,
  Transgender as TransgenderIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://127.0.0.1:8000/api/admin/candidates/"
        );
        console.log(res.data);
        if (Array.isArray(res.data)) {
          setCandidates(res.data);
        } else {
          setError("API did not return an array of candidates.");
        }
      } catch (err) {
        setError(`Failed to fetch candidates: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const deleteCandidate = async (id) => {
    if (!id) {
      return;
    }

    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/admin/candidates/${id}/delete/`
        );
        setCandidates((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        setError(`Delete failed: ${err.message}`);
      }
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "#fff3f3", color: "#d32f2f" }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: "center",
          mb: 4,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <PersonIcon fontSize="large" />
        All Candidates
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredCandidates.map((candidate) => (
          <Grid item xs={12} key={candidate.id}>
            <Card sx={{ mb: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {candidate.profile_picture && (
                    <Avatar
                      src={`http://localhost:8000${candidate.profile_picture}`}
                      alt={candidate.full_name}
                      sx={{ width: 80, height: 80, mr: 3 }}
                    />
                  )}
                  <Box>
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {candidate.full_name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      <Chip label={candidate.location} variant="outlined" />
                      {candidate.skills && (
                        <Chip
                          label={`Skills: ${candidate.skills
                            .split(",")
                            .slice(0, 2)
                            .join(", ")}`}
                          color="secondary"
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <EmailIcon color="action" />
                      <Typography variant="body1">{candidate.email}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <PhoneIcon color="action" />
                      <Typography variant="body1">
                        {candidate.phone_number}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <LocationOnIcon color="action" />
                      <Typography variant="body1">
                        {candidate.location}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <CakeIcon color="action" />
                      <Typography variant="body1">
                        DOB: {candidate.dob}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <TransgenderIcon color="action" />
                      <Typography variant="body1">
                        Gender: {candidate.gender}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <MenuBookIcon color="action" />
                      <Typography variant="body1">
                        Religion: {candidate.religion}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      Education & Experience
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <SchoolIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                          Education
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <b>High School:</b> {candidate.high_school_name} (
                          {candidate.high_school_degree},{" "}
                          {candidate.high_school_passing_year})
                        </Typography>
                        <Typography variant="body2">
                          <b>University:</b> {candidate.university_name} (
                          {candidate.university_degree},{" "}
                          {candidate.university_passing_year})
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <WorkIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                          Professional Experience
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {candidate.professional_experience || "Not specified"}
                        </Typography>
                        {candidate.resume && (
                          <Button
                            variant="outlined"
                            size="small"
                            component="a"
                            href={candidate.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<MenuBookIcon />}
                          >
                            View Resume
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => deleteCandidate(candidate.id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete Candidate
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminCandidates;
