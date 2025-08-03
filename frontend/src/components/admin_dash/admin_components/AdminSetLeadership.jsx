import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import "./AdminSetLeadership.css";

function AdminSetLeadership() {
  const [leaders, setLeaders] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    position: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeaders();
  }, []);

  // Fetch leaders data
  const fetchLeaders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/leadership/section/"
      );
      setLeaders(response.data);
      console.log("Leaders data:", response.data);
    } catch (error) {
      console.error("Error fetching leaders:", error);
      setError("Failed to load leadership data. Please try again later.");
      setSnackbar({
        open: true,
        message: "Failed to load leadership data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit mode
  const handleEdit = (leader) => {
    setEditMode(leader.id);
    setEditData({
      name: leader.name,
      position: leader.position,
      description: leader.description,
      image: leader.image,
    });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setSnackbar({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditData({ ...editData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save changes
  const handleSave = async (id) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("position", editData.position);
      formData.append("description", editData.description);

      // If editData.image is a File object, append it
      if (editData.image instanceof File) {
        formData.append("image", editData.image);
      } else {
        // If it's a URL string, pass it as is
        formData.append("image", editData.image);
      }

      const responce = await axios.put(
        `http://127.0.0.1:8000/api/admin/leadership/section/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Leader updated successfully", responce.data);
      setEditMode(null);
      setImagePreview(null);
      fetchLeaders();
      setSnackbar({
        open: true,
        message: "Leader updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating leader:", error);
      setSnackbar({
        open: true,
        message: "Failed to update leader information",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Container maxWidth="lg" className="leadership-container">
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          my: 4,
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main",
          borderBottom: "2px solid",
          borderColor: "primary.main",
          pb: 2,
        }}
      >
        Manage Leadership Team
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Skeleton variant="rectangular" width={500} height={200} />
                <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={100} />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={40}
                  sx={{ mt: 2 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button color="inherit" onClick={fetchLeaders} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {leaders.map((leader) => (
            <Grid
              item
              xs={12} // Changed from xs={12} sm={6} to xs={12}
              key={leader.id}
              className="leader-card-container"
            >
              <Card
                elevation={3}
                className="leader-card"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "row", // Changed from "column" to "row"
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {editMode === leader.id ? (
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box component="form">
                      <TextField
                        fullWidth
                        label="Name"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        margin="normal"
                        variant="outlined"
                        required
                        error={editData.name.trim() === ""}
                        helperText={
                          editData.name.trim() === "" ? "Name is required" : ""
                        }
                      />
                      <TextField
                        fullWidth
                        label="Position"
                        value={editData.position}
                        onChange={(e) =>
                          setEditData({ ...editData, position: e.target.value })
                        }
                        margin="normal"
                        variant="outlined"
                        required
                        error={editData.position.trim() === ""}
                        helperText={
                          editData.position.trim() === ""
                            ? "Position is required"
                            : ""
                        }
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        margin="normal"
                        variant="outlined"
                      />
                      <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id={`image-upload-${leader.id}`}
                          type="file"
                          onChange={handleImageChange}
                        />
                        <label htmlFor={`image-upload-${leader.id}`}>
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={<PhotoCameraIcon />}
                            color="secondary"
                          >
                            Upload Image
                          </Button>
                        </label>
                        {(imagePreview || editData.image) && (
                          <Box sx={{ mt: 2 }}>
                            <img
                              src={
                                imagePreview ||
                                `http://127.0.0.1:8000${editData.image}`
                              }
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: 200,
                                objectFit: "cover",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleSave(leader.id)}
                          color="success"
                          startIcon={
                            saving ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <SaveIcon />
                            )
                          }
                          disabled={
                            saving ||
                            editData.name.trim() === "" ||
                            editData.position.trim() === ""
                          }
                        >
                          {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditMode(null);
                            setImagePreview(null);
                          }}
                          color="error"
                          startIcon={<CancelIcon />}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                ) : (
                  <>
                    <CardMedia
                      component="img"
                      image={`http://127.0.0.1:8000${leader.image}`}
                      alt={leader.name}
                      sx={{
                        width: "200px", // Added fixed width for image
                        objectFit: "cover",
                      }}
                      className="leader-image"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ fontWeight: "bold" }}
                        >
                          {leader.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {leader.position}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {leader.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleEdit(leader)}
                          startIcon={<EditIcon />}
                          color="primary"
                        >
                          Edit Profile
                        </Button>
                      </CardActions>
                    </Box>
                  </>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminSetLeadership;
