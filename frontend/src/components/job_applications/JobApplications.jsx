/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./JobApplications.css";

// Material UI imports
import {
  CardContent,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Backdrop,
  Pagination,
  Divider,
  IconButton,
  Alert,
  Paper,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const ApplicationFeed = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [companyId, setCompanyId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    candidateEmail: "",
    message: "",
    jobId: "",
    candidateId: "",
    companyId: "",
    jobTitle: "",
    candidateName: "",
  });

  useEffect(() => {
    const companyData = sessionStorage.getItem("companyData");
    if (companyData) {
      const parsedCompanyData = JSON.parse(companyData);
      setCompanyId(parsedCompanyData.id);
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchApplications(currentPage, companyId);
    }
  }, [currentPage, companyId]);

  const fetchApplications = async (page, companyId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications/${companyId}/?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch applications.");
      }
      const data = await response.json();
      setApplications(data.results || []);

      const total = data.count || 0;
      const itemsPerPage = 6;
      setPageCount(Math.ceil(total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getCandidateDetails = async (candidateId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/candidate/details/${candidateId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch candidate details.");
      }
      const data = await response.json();

      // Update the state
      setEmailData((prevData) => ({
        ...prevData,
        candidateEmail: data.email,
        candidateName: data.full_name,
      }));
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      toast.error("Error fetching candidate details.");
    }
  };

  const deleteApplication = async (
    applicationId,
    candidateId,
    jobId,
    jobTitle,
    applicationResponse
  ) => {
    setGlobalLoading(true);

    try {
      // Check if application is not shortlisted
      if (applicationResponse !== "Shortlisted") {
        // Get candidate details and send rejection email
        const response = await fetch(
          `http://127.0.0.1:8000/api/candidate/details/${candidateId}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch candidate details.");
        }
        const candidateData = await response.json();

        // Send rejection email
        const emailResponse = await axios.post(
          "http://127.0.0.1:8000/api/send-email/",
          {
            candidateEmail: candidateData.email,
            message: `Dear ${candidateData.full_name},

                  Thank you for your interest in our company.

                  After careful consideration, we regret to inform you that we will not be moving forward with
                  your application at this time. We appreciate the time you took to apply and wish you success
                  in your job search.

                  Job ID: ${jobId}
                  Job Title: ${jobTitle}
                  Sent on: ${new Date().toLocaleDateString()}

                  Best regards,
                  Career Connect`,
            jobId: jobId,
            candidateId: candidateId,
            companyId: companyId,
          }
        );
      }

      // Delete application regardless of status
      const deleteResponse = await fetch(
        `http://127.0.0.1:8000/applications_del/${applicationId}/`,
        { method: "DELETE" }
      );

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete application.");
      }

      // Update UI
      setApplications(applications.filter((app) => app.id !== applicationId));

      // Show appropriate success message
      if (applicationResponse !== "Shortlisted") {
        toast.success(
          "Application deleted and rejection email sent successfully."
        );
      } else {
        toast.success("Application deleted successfully.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        applicationResponse !== "Shortlisted"
          ? "Error deleting application or sending rejection email."
          : "Error deleting application."
      );
    } finally {
      setGlobalLoading(false);
    }
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const viewCandidateDetails = (candidateId) => {
    navigate(`/candidate/apply/details/${candidateId}`);
  };

  const openEmailModal = (candidateEmail, jobId, candidateId, companyId) => {
    setEmailData({
      candidateEmail,
      jobId,
      candidateId,
      companyId,
      message: "",
    });
    setIsModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsModalOpen(false);
    setEmailData({
      candidateEmail: "",
      message: "",
      jobId: "",
      candidateId: "",
      companyId: "",
    });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setGlobalLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/send-email/",
        {
          candidateEmail: emailData.candidateEmail,
          message: emailData.message,
          jobId: emailData.jobId,
          candidateId: emailData.candidateId,
          companyId: emailData.companyId,
        }
      );
      toast.success(response.data.success || "Email sent successfully!");
      closeEmailModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending email");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleStatusChange = async (e, applicationId) => {
    const newStatus = e.target.value;
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
    try {
      await setApplicationResponse(applicationId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update application status");
    }
  };

  const setApplicationResponse = async (applicationId, newStatus) => {
    setGlobalLoading(true);
    try {
      const requestData = {
        application_id: applicationId,
        response: newStatus,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/applications/update-response/",
        requestData
      );

      if (response.status === 200) {
        toast.success("Response updated successfully.");
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.id === applicationId
              ? { ...app, status: newStatus, showSetResponseButton: false }
              : app
          )
        );
      } else {
        throw new Error(
          `Failed to update response. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating response:", error);
      toast.error(
        "Error updating response: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setGlobalLoading(false);
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    applicationId: null,
    candidateId: null,
    jobId: null,
    jobTitle: null,
    applicationResponse: null, // Add this line
  });

  const openConfirmDialog = (
    applicationId,
    candidateId,
    jobId,
    jobTitle,
    applicationResponse
  ) => {
    setConfirmDialog({
      open: true,
      applicationId,
      candidateId,
      jobId,
      jobTitle,
      applicationResponse, // Add this line
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      applicationId: null,
      candidateId: null,
      jobId: null,
      jobTitle: null,
      applicationResponse: null, // Add this line
    });
  };
  // Update the confirmDelete function
  const confirmDelete = () => {
    const { applicationId, candidateId, jobId, jobTitle, applicationResponse } =
      confirmDialog;
    deleteApplication(
      applicationId,
      candidateId,
      jobId,
      jobTitle,
      applicationResponse // Add this parameter
    );
    closeConfirmDialog();
  };

  return (
    <Box sx={{ py: 2, minHeight: "100vh" }}>
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Global loading backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={globalLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
            <Typography variant="h5" fontWeight="bold">
              Applications for your job posts
            </Typography>
          </Box>

          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {applications.length === 0 ? (
                  <Alert severity="info" sx={{ my: 2 }}>
                    No applications found.
                  </Alert>
                ) : (
                  <List>
                    {applications.map((app) => (
                      <React.Fragment key={app.id}>
                        <ListItem
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "flex-start", md: "center" },
                            py: 2,
                            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="bold">
                                {app.candidate__full_name}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Applied for <em>{app.job_title}</em> (Job ID:{" "}
                                {app.job_id})
                                <br />
                                on {new Date(app.time).toLocaleDateString()}
                              </Typography>
                            }
                            sx={{ flex: 1 }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              mt: { xs: 2, md: 0 },
                              gap: 1,
                              width: { xs: "100%", md: "auto" },
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                viewCandidateDetails(app.candidate_id)
                              }
                            >
                              View
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() =>
                                openConfirmDialog(
                                  app.id,
                                  app.candidate_id,
                                  app.job_id,
                                  app.job_title,
                                  app.application_response // Make sure this matches your data structure
                                )
                              }
                            >
                              Delete
                            </Button>

                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<EmailIcon />}
                              onClick={() => {
                                getCandidateDetails(app.candidate_id);
                                openEmailModal(
                                  app.candidate__email,
                                  app.job_id,
                                  app.candidate_id,
                                  companyId
                                );
                              }}
                            >
                              Email
                            </Button>

                            <FormControl
                              variant="outlined"
                              size="small"
                              sx={{ minWidth: 150 }}
                            >
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={
                                  app.application_response ||
                                  "Application Submitted"
                                }
                                onChange={(e) => handleStatusChange(e, app.id)}
                                label="Status"
                              >
                                <MenuItem value="Application Submitted">
                                  Application Submitted
                                </MenuItem>
                                <MenuItem value="Under Review">
                                  Under Review
                                </MenuItem>
                                <MenuItem value="Interview Scheduled">
                                  Interview Scheduled
                                </MenuItem>
                                <MenuItem value="Shortlisted">
                                  Shortlisted
                                </MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}

                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </CardContent>
        </Paper>
      </div>

      {/* Email Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeEmailModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Send Email</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeEmailModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, mt: 2 }}>
          <form onSubmit={handleSendEmail}>
            <TextField
              fullWidth
              type="email"
              margin="normal"
              value={emailData.candidateEmail}
              onChange={(e) =>
                setEmailData({
                  ...emailData,
                  candidateEmail: e.target.value,
                })
              }
              required
            />

            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              margin="normal"
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              required
            />

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={globalLoading}
                startIcon={
                  globalLoading ? <CircularProgress size={20} /> : <SendIcon />
                }
              >
                {globalLoading ? "Sending..." : "Send Email"}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
          Confirm Delete Application?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this application? If candidate is
            not <span className="text-danger">ShortListed</span>, a rejection
            mail will be sent to the candidate.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationFeed;
