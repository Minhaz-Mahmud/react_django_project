import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Box, Button, Container, Grid, Typography, TextField, Chip, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const careerLevels = ["Entry Level", "Mid Level", "Senior Level"];
const jobTypes = ["Remote", "On-site", "Hybrid"];

const CareerOpportunities = () => {
  const navigate = useNavigate(); // ✅ Moved inside the component

  const [formData, setFormData] = useState({ skills: "", degree: "", experience: "", jobType: "", location: "" });
  const userId = localStorage.getItem("userId");

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const onFindJobs = async () => {
    if (Object.values(formData).some(value => !value)) {
      toast.error("Please fill all details");
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/find-jobs/", {
        skills: formData.skills,
        degree: formData.degree,
        experience: formData.experience,
        jobType: formData.jobType,
        location: formData.location,
      });
  
      if (response.status === 200) {
        toast.success("Job suggestions found!");
        console.log("Job Data:", response.data);
  
        // Ensure the data is correctly passed
        navigate("/job-results", { state: { jobs: response.data.jobs } });
      }
    } catch (error) {
      console.error("Error finding jobs:", error);
      toast.error("Failed to find job suggestions");
    }
  };
  
  
  

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>Career Opportunities 🌐</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>Find job opportunities based on your skills and qualifications</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <label htmlFor="skills">Skills</label>
          <TextField id="skills" fullWidth variant="outlined" placeholder="e.g. Python, React" value={formData.skills} onChange={(e) => handleInputChange("skills", e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <label htmlFor="degree">Degree</label>
          <TextField id="degree" fullWidth variant="outlined" placeholder="e.g. B.Sc. in CSE" value={formData.degree} onChange={(e) => handleInputChange("degree", e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <label htmlFor="experience">Experience Level</label>
          <TextField id="experience" select fullWidth variant="outlined" value={formData.experience} onChange={(e) => handleInputChange("experience", e.target.value)}>
            {careerLevels.map((level, index) => (
              <MenuItem key={index} value={level}>{level}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Preferred Job Type</Typography>
          {jobTypes.map((type, index) => (
            <Chip key={index} label={type} onClick={() => handleInputChange("jobType", type)} sx={{ m: 1, cursor: "pointer" }} color={formData.jobType === type ? "primary" : "default"} />
          ))}
        </Grid>
        <Grid item xs={12}>
          <label htmlFor="location">Location</label>
          <TextField id="location" fullWidth variant="outlined" placeholder="e.g. Dhaka, Bangladesh" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Button variant="contained" color="primary" fullWidth size="large" onClick={onFindJobs}>Find Jobs</Button>
      </Box>
    </Container>
  );
};

export default CareerOpportunities;


