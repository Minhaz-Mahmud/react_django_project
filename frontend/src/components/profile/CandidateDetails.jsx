import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
  Chip,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  School,
  Cake,
  Male,
  Female,
  Download,
} from "@mui/icons-material";
import "./CandidateDetails.css";

const CandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/candidates/${candidateId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch candidate details.");
      }
      const data = await response.json();
      setCandidateDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const defaultProfilePicture = "/profile.jpg";
  const profileImage = candidateDetails?.profile_picture
    ? `http://localhost:8000${candidateDetails.profile_picture}`
    : defaultProfilePicture;
  const resumeLink = candidateDetails?.resume
    ? `http://localhost:8000${candidateDetails.resume}`
    : null;

  const getGenderIcon = () => {
    if (!candidateDetails?.gender) return null;
    return candidateDetails.gender === "Male" ? <Male /> : <Female />;
  };

  const renderField = (value, fallback = "Not available") => {
    return value || fallback;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!candidateDetails) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No candidate details found
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h4" component="h1">
              Candidate Profile
            </Typography>
          }
        />

        <CardContent>
          <Grid container spacing={4}>
            {/* Left Column - Profile Image and Resume */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={getGenderIcon()}
                >
                  <Avatar
                    src={profileImage}
                    sx={{
                      width: 200,
                      height: 200,
                      mb: 3,
                      boxShadow: 3,
                    }}
                  />
                </Badge>

                {resumeLink && (
                  <Box width="100%" mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Download />}
                      href={resumeLink}
                      target="_blank"
                      download
                      fullWidth
                    >
                      Download Resume
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Column - Candidate Details */}
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom>
                {candidateDetails.full_name}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Basic Information */}
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={renderField(candidateDetails.email)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={renderField(candidateDetails.phone_number)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={renderField(candidateDetails.location)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Cake color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={renderField(
                        candidateDetails.dob,
                        candidateDetails.age
                          ? `${candidateDetails.age} years old`
                          : "Not available"
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {getGenderIcon() || <Male color="primary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Gender"
                      secondary={renderField(candidateDetails.gender)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Religion"
                      secondary={renderField(candidateDetails.religion)}
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* Education */}
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                <Typography variant="h6" gutterBottom>
                  Education
                </Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  High School
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="School Name"
                      secondary={renderField(candidateDetails.high_school_name)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Degree"
                      secondary={renderField(
                        candidateDetails.high_school_degree
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Passing Year"
                      secondary={renderField(
                        candidateDetails.high_school_passing_year
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Grade"
                      secondary={renderField(
                        candidateDetails.high_school_grade
                      )}
                    />
                  </ListItem>
                </List>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  University
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="University Name"
                      secondary={renderField(candidateDetails.university_name)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Degree"
                      secondary={renderField(
                        candidateDetails.university_degree
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Passing Year"
                      secondary={renderField(
                        candidateDetails.university_passing_year
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Grade"
                      secondary={renderField(candidateDetails.university_grade)}
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* Professional Experience */}
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                <Typography variant="h6" gutterBottom>
                  Professional Experience
                </Typography>
                <Typography paragraph>
                  {renderField(
                    candidateDetails.professional_experience,
                    "No professional experience provided"
                  )}
                </Typography>
              </Paper>

              {/* Skills */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {candidateDetails.skills &&
                  candidateDetails.skills.length > 0 ? (
                    candidateDetails.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill.trim()}
                        variant="outlined"
                        color="primary"
                      />
                    ))
                  ) : (
                    <Typography>No skills listed</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CandidateDetails;
