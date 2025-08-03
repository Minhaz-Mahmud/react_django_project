import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  Container,
  Box,
  CircularProgress,
  IconButton,
  Divider,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  QuestionAnswer as FaqIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./AdminSetFaq.css";

function AdminSetFaq() {
  const [faqs, setFaqs] = useState([]);
  const [editFaq, setEditFaq] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/faq/section/"
      );
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs. Please try again.");
      setSnackbar({
        open: true,
        message: "Failed to load FAQs. Please check your connection.",
        severity: "error",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditClick = (faq) => {
    setEditFaq(faq);

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditFaq(null);
  };

  const handleUpdateFaq = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/faq/section/${editFaq.id}/`,
        editFaq
      );
      const updatedFaqs = faqs.map((faq) =>
        faq.id === editFaq.id ? response.data : faq
      );
      setFaqs(updatedFaqs);
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "FAQ updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating FAQ:", error);
      setSnackbar({
        open: true,
        message:
          "Failed to update FAQ. " +
          (error.response?.data?.message || "Please try again."),
        severity: "error",
      });
    }
    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="admin-faq-page py-4">
      <Container maxWidth="lg" className="faq-container">
        <Box className="d-flex justify-content-between align-items-center mb-4">
          <Box className="d-flex align-items-center">
            <FaqIcon className="me-2" fontSize="large" color="primary" />
            <Typography variant="h4" className="fw-bold">
              Manage FAQs
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Refresh FAQs">
              <IconButton
                color="primary"
                onClick={fetchFaqs}
                className="me-2"
                disabled={refreshing}
              >
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider className="mb-4" />

        {faqs.length === 0 && !refreshing ? (
          <Paper elevation={2} className="p-4 text-center">
            <Typography variant="h6" color="textSecondary">
              No FAQs found. Click &quot;Add New FAQ&quot; to create your first
              FAQ.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            {faqs.map((faq) => (
              <Paper
                key={faq.id}
                className="faq-item p-4 position-relative mb-3"
                elevation={3}
              >
                <Box className="faq-content">
                  <Typography variant="h5" className="faq-title mb-2">
                    {faq.title}
                  </Typography>
                  <Divider className="my-2" />
                  <Typography variant="body1" className="faq-description">
                    {faq.description}
                  </Typography>
                </Box>
                <Box className="faq-actions mt-3 d-flex justify-content-end">
                  <Tooltip title="Edit FAQ">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(faq)}
                      className="me-2"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* Edit/Add FAQ Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="dialog-title">{"Edit FAQ"}</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Title"
              value={editFaq?.title || ""}
              onChange={(e) =>
                setEditFaq({ ...editFaq, title: e.target.value })
              }
              margin="normal"
              variant="outlined"
              required
              error={!editFaq?.title}
            />
            <TextField
              fullWidth
              label="Description"
              value={editFaq?.description || ""}
              onChange={(e) =>
                setEditFaq({ ...editFaq, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={6}
              variant="outlined"
              required
              error={!editFaq?.description}
            />
          </DialogContent>
          <DialogActions className="dialog-actions p-3">
            <Button
              onClick={handleCloseDialog}
              color="secondary"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateFaq}
              color="primary"
              variant="contained"
              disabled={loading || !editFaq?.title || !editFaq?.description}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast notification container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* MUI Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
            elevation={6}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default AdminSetFaq;
