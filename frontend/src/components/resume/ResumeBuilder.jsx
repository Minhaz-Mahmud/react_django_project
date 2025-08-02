/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Stack,
  Fab,
  Backdrop,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  AccountCircle as AccountCircleIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const ResumeBuilder = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [templateSelectionModal, setTemplateSelectionModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editingResume, setEditingResume] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    gender: "male",
    dob: "",
    address: "",
    religion: "",
    skillset: ["", "", "", "", ""],
    education: {
      highSchool: {
        name: "",
        degree: "",
        year: "",
        grade: "",
      },
      varsity: {
        name: "",
        degree: "",
        year: "",
        grade: "",
        cga: "",
        passingYear: "",
      },
    },
    experience: "",
  });
  const [resumes, setResumes] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchResumes();
    fetchProfileData();
  }, []);

  const fetchResumeForEdit = async (resumeId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get-resume-data/${resumeId}/`
      );
      console.log("Resume data fetched:", response.data);

      if (response.status === 200) {
        const resumeData = response.data;

        // Convert resume data to form format
        const convertedData = {
          name: resumeData.name || "",
          title: resumeData.title || "",
          email: resumeData.email || "",
          phone: resumeData.phone || "",
          gender: resumeData.gender || "male",
          dob: resumeData.dob || "",
          address: resumeData.address || "",
          religion: resumeData.religion || "",
          skillset: resumeData.skillset || ["", "", "", "", ""],
          education: resumeData.education || {
            highSchool: {
              name: "",
              degree: "",
              year: "",
              grade: "",
            },
            varsity: {
              name: "",
              degree: "",
              year: "",
              grade: "",
              cga: "",
              passingYear: "",
            },
          },
          experience: resumeData.experience || "",
        };

        // Ensure skillset has exactly 5 elements
        while (convertedData.skillset.length < 5) {
          convertedData.skillset.push("");
        }

        setEditFormData(convertedData);
        setEditingResume(resumeData);
        setEditModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
      toast.error("Failed to load resume data for editing");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));
      if (!candidateData) {
        toast.error("Please log in to update CV");
        return;
      }

      const submissionData = {
        ...formData,
        candidate_id: candidateData.id,
      };

      // Determine which template to use based on the original resume
      const templateNumber = editingResume.template_number || 1;
      const endpoint = `http://127.0.0.1:8000/api/generate-cv${
        templateNumber > 1 ? templateNumber : ""
      }/`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        await handleDelete(editingResume.id);
        setEditModalOpen(false);
        setEditFormData(null);
        setEditingResume(null);
        setDownloadLink(`http://127.0.0.1:8000${result.cv_url}`);
        setSuccessMessage("CV updated successfully!");
        fetchResumes(); // Refresh the resume list
        toast.success("Resume updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update CV");
      }
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Error updating CV");
    }
  };

  const fetchProfileData = async () => {
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

    if (!candidateData) {
      return;
    } else {
      console.log("Candidate ID:", candidateData.id);
      console.log("candidate data:", candidateData);
    }
  };

  const convertProfileToFormData = (profile) => {
    const skillsArray = profile.skills
      ? profile.skills
          .split(",")
          .map((skill) => skill.trim())
          .slice(0, 5)
      : ["", "", "", "", ""];

    while (skillsArray.length < 5) {
      skillsArray.push("");
    }

    return {
      name: profile.full_name || "",
      title: profile.professional_experience ? "Professional" : "",
      email: profile.email || "",
      phone: profile.phone_number || "",
      gender:
        profile.gender === "M"
          ? "male"
          : profile.gender === "F"
          ? "female"
          : "male",
      dob: profile.dob || "",
      address: profile.location || "",
      religion: profile.religion || "",
      skillset: skillsArray,
      education: {
        highSchool: {
          name: profile.high_school_name || "",
          degree: profile.high_school_degree || "",
          year: profile.high_school_passing_year?.toString() || "",
          grade: profile.high_school_grade || "",
        },
        varsity: {
          name: profile.university_name || "",
          degree: profile.university_degree || "",
          year: profile.university_passing_year?.toString() || "",
          grade: profile.university_grade || "",
          cga: profile.university_grade || "",
          passingYear: profile.university_passing_year?.toString() || "",
        },
      },
      experience: profile.professional_experience || "",
    };
  };

  const handleTemplateClick = (templateNumber) => {
    setSelectedTemplate(templateNumber);
    setTemplateSelectionModal(true);
  };

  const handleTemplateOptionSelect = (option) => {
    setTemplateSelectionModal(false);

    if (option === "profile") {
      const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

      if (!candidateData) {
        return;
      } else {
        generateCVFromProfile();
      }
    } else if (option === "raw") {
      const convertedData = profileData
        ? convertProfileToFormData(profileData)
        : {
            name: "",
            title: "",
            email: "",
            phone: "",
            gender: "",
            dob: "",
            address: "",
            religion: "",
            skillset: ["", "", "", "", ""],
            education: {
              highSchool: {
                name: "",
                degree: "",
                year: "",
                grade: "",
              },
              varsity: {
                name: "",
                degree: "",
                year: "",
                grade: "",
                cga: "",
                passingYear: "",
              },
            },
            experience: "",
          };
      setFormData({ ...convertedData });

      // Open the correct modal
      if (selectedTemplate === 1) {
        setModalIsOpen(true);
      } else if (selectedTemplate === 2) {
        setModalIsOpen2(true);
      } else if (selectedTemplate === 3) {
        setModalIsOpen3(true);
      }
    }
  };

  const generateCVFromProfile = async () => {
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

    if (!candidateData) {
      toast.error("No candidate data found. Please log in again.");
      return;
    }

    const profileFormData = {
      name: candidateData.full_name || "",
      title: candidateData.professional_experience ? "Professional" : "",
      email: candidateData.email || "",
      phone: candidateData.phone_number || "",
      gender:
        candidateData.gender === "M"
          ? "male"
          : candidateData.gender === "F"
          ? "female"
          : "male",
      dob: candidateData.dob || "",
      address: candidateData.location || "",
      religion: candidateData.religion || "",
      skillset: candidateData.skills
        ? candidateData.skills
            .split(",")
            .map((skill) => skill.trim())
            .slice(0, 5)
        : ["", "", "", "", ""],
      education: {
        highSchool: {
          name: candidateData.high_school_name || "",
          degree: candidateData.high_school_degree || "",
          year: candidateData.high_school_passing_year?.toString() || "",
          grade: candidateData.high_school_grade || "",
        },
        varsity: {
          name: candidateData.university_name || "",
          degree: candidateData.university_degree || "",
          year: candidateData.university_passing_year?.toString() || "",
          grade: candidateData.university_grade || "",
          cga: candidateData.university_grade || "",
          passingYear: candidateData.university_passing_year?.toString() || "",
        },
      },
      experience: candidateData.professional_experience || "",
      candidate_id: candidateData.id,
      // Add a flag to indicate this is complete profile data
      is_profile_data: true,
    };

    // Pad skillset with empty strings if less than 5 skills
    while (profileFormData.skillset.length < 5) {
      profileFormData.skillset.push("");
    }

    try {
      const endpoint =
        selectedTemplate === 1
          ? "http://127.0.0.1:8000/api/generate-cv/"
          : selectedTemplate === 2
          ? "http://127.0.0.1:8000/api/generate-cv2/"
          : "http://127.0.0.1:8000/api/generate-cv3/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileFormData),
      });

      if (response.ok) {
        const result = await response.json();
        const downloadUrl = `http://127.0.0.1:8000${result.cv_url}`;
        setDownloadLink(downloadUrl);
        setSuccessMessage("CV generated successfully from your profile!");
        fetchResumes();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to generate CV");
        setErrorMessage(errorData.error || "Failed to generate CV");
      }
    } catch (error) {
      console.error("Error generating CV:", error);
      toast.error("Error generating CV");
      setErrorMessage("Error generating CV");
    }
  };

  const fetchResumes = async () => {
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

    if (!candidateData) {
      toast.error("Please log in to view your resumes.");
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/candidate/get/resumes/",
        {
          params: { candidate_id: candidateData.id },
        }
      );
      setResumes(response.data);
    } catch (e) {
      const errorMessage =
        e.response?.data?.error || "Failed to fetch resumes.";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (resumeId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/delete_resume/${resumeId}/`
      );

      if (response.status === 200) {
        setResumes((prevList) =>
          prevList.filter((resume) => resume.id !== resumeId)
        );

        toast.success("Resume deleted successfully!");
        setSuccessMessage("Resume deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume. Please try again.");
      setErrorMessage("Failed to delete resume. Please try again.");
    }
  };

  const handleSubmit = async (formData, closeModal) => {
    await submitFormData(formData, 1, closeModal);
  };

  const handleSubmit2 = async (formData, closeModal) => {
    await submitFormData(formData, 2, closeModal);
  };

  const handleSubmit3 = async (formData, closeModal) => {
    await submitFormData(formData, 3, closeModal);
  };

  const submitFormData = async (formData, templateNumber, closeModal) => {
    const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

    if (!candidateData) {
      toast.error("Please log in to generate CV");
      return;
    }

    const submissionData = {
      ...formData,
      candidate_id: candidateData.id,
    };

    try {
      const endpoint =
        templateNumber === 1
          ? "http://127.0.0.1:8000/api/generate-cv/"
          : templateNumber === 2
          ? "http://127.0.0.1:8000/api/generate-cv2/"
          : "http://127.0.0.1:8000/api/generate-cv3/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        const downloadUrl = `http://127.0.0.1:8000${result.cv_url}`;
        setDownloadLink(downloadUrl);
        setSuccessMessage("CV generated successfully!");

        fetchResumes();
        closeModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to generate CV");
        setErrorMessage(errorData.error || "Failed to generate CV");
      }
    } catch (error) {
      console.error("Error generating CV:", error);
      toast.error("Error generating CV");
      setErrorMessage("Error generating CV");
    }
  };

  const ResumeForm = ({ onSubmit, templateNumber, initialFormData }) => {
    const [localFormData, setLocalFormData] = useState(initialFormData);
    useEffect(() => {
      setLocalFormData(initialFormData);
    }, [initialFormData]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setLocalFormData({ ...localFormData, [name]: value });
    };

    const handleSkillChange = (index, value) => {
      const newSkills = [...localFormData.skillset];
      newSkills[index] = value;
      setLocalFormData({ ...localFormData, skillset: newSkills });
    };

    const handleEducationChange = (level, field, value) => {
      setLocalFormData({
        ...localFormData,
        education: {
          ...localFormData.education,
          [level]: {
            ...localFormData.education[level],
            [field]: value,
          },
        },
      });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(localFormData);
    };

    return (
      <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
        {/* Personal Information Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6">Personal Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={localFormData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={localFormData.email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={localFormData.phone}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={localFormData.dob}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={localFormData.gender}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  name="address"
                  value={localFormData.address}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Religion"
                  name="religion"
                  value={localFormData.religion}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              {templateNumber > 1 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Professional Title"
                    name="title"
                    value={localFormData.title}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Skills Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StarIcon color="primary" />
              <Typography variant="h6">Professional Skills (Max 5)</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {localFormData.skillset.map((skill, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    fullWidth
                    label={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Education Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon color="primary" />
              <Typography variant="h6">Education</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              High School
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={localFormData.education.highSchool.name}
                  onChange={(e) =>
                    handleEducationChange("highSchool", "name", e.target.value)
                  }
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certificate/Degree"
                  value={localFormData.education.highSchool.degree}
                  onChange={(e) =>
                    handleEducationChange(
                      "highSchool",
                      "degree",
                      e.target.value
                    )
                  }
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year"
                  value={localFormData.education.highSchool.year}
                  onChange={(e) =>
                    handleEducationChange("highSchool", "year", e.target.value)
                  }
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Grade"
                  value={localFormData.education.highSchool.grade}
                  onChange={(e) =>
                    handleEducationChange("highSchool", "grade", e.target.value)
                  }
                  required
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              University
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="University Name"
                  value={localFormData.education.varsity.name}
                  onChange={(e) =>
                    handleEducationChange("varsity", "name", e.target.value)
                  }
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={localFormData.education.varsity.degree}
                  onChange={(e) =>
                    handleEducationChange("varsity", "degree", e.target.value)
                  }
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Passing Year"
                  value={localFormData.education.varsity.passingYear}
                  onChange={(e) =>
                    handleEducationChange(
                      "varsity",
                      "passingYear",
                      e.target.value
                    )
                  }
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CGPA"
                  value={localFormData.education.varsity.cga}
                  onChange={(e) =>
                    handleEducationChange("varsity", "cga", e.target.value)
                  }
                  required
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Experience Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WorkIcon color="primary" />
              <Typography variant="h6">Professional Experience</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Professional Experience"
              name="experience"
              value={localFormData.experience}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<DescriptionIcon />}
            sx={{ px: 4 }}
          >
            Generate Resume
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "white" }}
        >
          Resume Builder
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose from professional templates and create your perfect resume
        </Typography>
      </Box>

      {/* Template Selection */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {[1, 2, 3].map((templateNum) => (
          <Grid item xs={12} md={4} key={templateNum}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={`/assets/cv_temp${templateNum}.${
                  templateNum === 3 ? "png" : "jpg"
                }`}
                alt={`Template ${templateNum}`}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Template {templateNum}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional CV template with modern design and clean layout
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => handleTemplateClick(templateNum)}
                  startIcon={<AddIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: "bold",
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1976D2 30%, #0097A7 90%)",
                    },
                  }}
                >
                  Generate CV
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Template Selection Modal */}
      <Dialog
        open={templateSelectionModal}
        onClose={() => setTemplateSelectionModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Choose CV Generation Method
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            How would you like to generate your CV?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <Stack spacing={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handleTemplateOptionSelect("profile")}
              startIcon={<AccountCircleIcon />}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #388E3C 30%, #689F38 90%)",
                },
              }}
            >
              Generate CV using Profile Data
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleTemplateOptionSelect("raw")}
              startIcon={<EditIcon />}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              Generate CV with Custom Data
            </Button>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>Important Note</AlertTitle>
              If Profile data is not available, Generated resume will be
              incomplete.
            </Alert>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Form Modals */}
      {[
        {
          open: modalIsOpen,
          close: () => setModalIsOpen(false),
          submit: (data) => handleSubmit(data, setModalIsOpen),
          number: 1,
        },
        {
          open: modalIsOpen2,
          close: () => setModalIsOpen2(false),
          submit: (data) => handleSubmit2(data, setModalIsOpen2),
          number: 2,
        },
        {
          open: modalIsOpen3,
          close: () => setModalIsOpen3(false),
          submit: (data) => handleSubmit3(data, setModalIsOpen3),
          number: 3,
        },
      ].map(({ open, close, submit, number }) => (
        <Dialog
          key={number}
          open={open}
          onClose={close}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, maxHeight: "90vh" },
          }}
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Enter Your Details - Template {number}
              </Typography>
              <IconButton onClick={close} size="large">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ px: 3 }}>
            <ResumeForm
              onSubmit={submit}
              templateNumber={number}
              initialFormData={formData}
            />
          </DialogContent>
        </Dialog>
      ))}

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: "90vh" },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Edit Resume
            </Typography>
            <IconButton onClick={() => setEditModalOpen(false)} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          {editFormData && (
            <ResumeForm
              onSubmit={handleEditSubmit}
              templateNumber={editingResume?.template_number || 1}
              initialFormData={editFormData}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Download Link Alert */}
      {downloadLink && (
        <Alert
          severity="success"
          sx={{ mb: 4, borderRadius: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setDownloadLink("")}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>CV Generated Successfully!</AlertTitle>
          Your CV has been generated!{" "}
          <Button
            component="a"
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            download
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{ ml: 2 }}
          >
            Download CV
          </Button>
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 4, borderRadius: 2 }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      )}

      {/* Resume List Section */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Your Generated CVs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and download your previously generated resumes
          </Typography>
        </Box>

        {resumes.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <DescriptionIcon
              sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No resumes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate your first resume using one of the templates above
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {resumes.map((resume) => (
              <Grid item xs={12} key={resume.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container alignItems="center" spacing={2}>
                      {/* Left section with resume info */}
                      <Grid item xs={12} md={8}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {/* Header */}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <DescriptionIcon
                              sx={{ mr: 1, color: "primary.main" }}
                            />
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold" }}
                            >
                              Resume
                            </Typography>
                          </Box>

                          {/* Date and Time */}
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            <Chip
                              label={`Created: ${format(
                                new Date(resume.created_at),
                                "dd MMM yyyy"
                              )}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`Template: ${resume.template_number}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`Time: ${format(
                                new Date(resume.created_at),
                                "HH:mm:ss"
                              )}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Grid>

                      {/* Right section with thumbnail */}
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ alignSelf: "flex-start" }}
                          >
                            Thumbnail Preview:
                          </Typography>
                          <CardMedia
                            component="img"
                            image={`http://127.0.0.1:8000${resume.thumbnail}`}
                            alt="Resume thumbnail"
                            sx={{
                              height: 120,
                              width: "100%",
                              objectFit: "contain",
                              borderRadius: 1,
                              border: "1px solid #eee",
                              backgroundColor: "white",
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <CardActions
                    sx={{ p: 2, pt: 0, justifyContent: "space-between" }}
                  >
                    <Button
                      component="a"
                      href={`http://127.0.0.1:8000${resume.cv_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      size="small"
                      startIcon={<PreviewIcon />}
                      sx={{
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1976D2 30%, #0097A7 90%)",
                        },
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={() => {
                        console.log(
                          "Edit button clicked for resume:",
                          resume.id
                        );
                        fetchResumeForEdit(resume.id);
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{
                        background:
                          "linear-gradient(45deg, #21f391ff 30%, #21f364ff 90%)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #19d279f8 30%, #00a74eff 90%)",
                        },
                      }}
                    >
                      Edit
                    </Button>

                    <IconButton
                      onClick={() => handleDelete(resume.id)}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "white",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
};

export default ResumeBuilder;
