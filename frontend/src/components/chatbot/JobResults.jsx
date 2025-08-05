import React from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import "./JobResults.css"; // Ensure CSS file is correctly imported

const JobResults = () => {
const location = useLocation();
const stateData = location.state || {};
console.log("📦 Received state:", location.state);

const jobs = Array.isArray(stateData.jobs) ? stateData.jobs : [];
const futureOpportunities = Array.isArray(stateData.future_opportunities) ? stateData.future_opportunities : [];
const skillsToLearn = Array.isArray(stateData.skills_to_learn) ? stateData.skills_to_learn : [];


  return (
    <Container maxWidth="lg" className="job-results-container">
      <Typography variant="h4" className="job-results-title">
        Career Insights 🚀
      </Typography>

      {/* Eligible Jobs Section */}
      <Typography variant="h5" className="section-title">
     <span className="emoji">✅</span> Jobs You Are Eligible For:
      </Typography>
      {jobs.length === 0 ? (
        <Typography variant="h6" className="no-jobs">
          No matching jobs found. Try refining your profile.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card className="job-card">
                <CardContent>
                  <Typography variant="h5" className="job-title">
                    {job.job_title || "Unknown Job Title"}
                  </Typography>

                  {/* Required Skills */}
                  {job.required_skills && job.required_skills.length > 0 ? (
                    <>
                      <Typography variant="subtitle2" className="skills-header">
                        Required Skills:
                      </Typography>
                      <Grid container spacing={1}>
                        {job.required_skills.map((skill, idx) => (
                          <Grid item key={idx}>
                            <Chip
                              label={skill}
                              variant="outlined"
                              className="skill-chip"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  ) : (
                    <Typography variant="body2" className="no-skills">
                      No specific skills required.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Future Opportunities Section */}
      <Typography variant="h5" className="section-title">
        <span className="emoji">📈</span> Future Career Opportunities:
     </Typography>
      {futureOpportunities.length === 0 ? (
        <Typography variant="body1" className="no-opportunities">
          No future job suggestions available.
        </Typography>
      ) : (
        <Grid container spacing={1} className="opportunities-container">
          {futureOpportunities.map((job, index) => (
            <Grid item key={index}>
              <Chip label={job} color="success" className="opportunity-chip" />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Skills to Learn Section */}
    <Typography variant="h5" className="section-title">
    <span className="emoji">🎯</span> Skills to Learn for the Future:
     </Typography>

      {skillsToLearn.length === 0 ? (
        <Typography variant="body1" className="no-skills">
          No skill recommendations available.
        </Typography>
      ) : (
        <Grid container spacing={1} className="skills-container">
          {skillsToLearn.map((skill, index) => (
            <Grid item key={index}>
              <Chip label={skill} color="warning" className="skill-chip" />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default JobResults;

