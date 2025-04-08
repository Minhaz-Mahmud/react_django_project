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
  const jobs = location.state?.jobs || [];
  const futureOpportunities = location.state?.future_opportunities || [];
  const skillsToLearn = location.state?.skills_to_learn || [];

  return (
    <Container maxWidth="lg" className="job-results-container">
      <Typography variant="h4" className="job-results-title">
        Career Insights 🚀
      </Typography>

      {/* Eligible Jobs Section */}
      <Typography variant="h5" className="section-title">
        ✅ Jobs You Are Eligible For:
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
      {/* <Typography variant="h5" className="section-title">
        📈 Future Career Opportunities:
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
      )} */}

      {/* Skills to Learn Section */}
      {/* <Typography variant="h5" className="section-title">
        🎯 Skills to Learn for the Future:
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
      )} */}
    </Container>
  );
};

export default JobResults;

// import React from "react";
// import { useLocation } from "react-router-dom";
// import { Container, Card, CardContent, Typography, Grid, Chip } from "@mui/material";
// import "./JobResults.css"; // Importing the new CSS file

// const JobResults = () => {
//   const location = useLocation();
//   const jobs = location.state?.jobs || [];
//   const futureOpportunities = location.state?.future_opportunities || [];
//   const skillsToLearn = location.state?.skills_to_learn || [];

//   return (
//     <Container maxWidth="lg" className="job-results-container">
//       <Typography variant="h4" className="job-results-title">
//         Career Insights 🚀
//       </Typography>

//       {/* Eligible Jobs */}
//       <Typography variant="h5" className="section-title">
//         ✅ Jobs You Are Eligible For:
//       </Typography>
//       {jobs.length === 0 ? (
//         <Typography variant="h6" className="no-jobs">
//           No matching jobs found. Try refining your profile.
//         </Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {jobs.map((job, index) => (
//             <Grid item xs={12} md={6} key={index}>
//               <Card className="job-card">
//                 <CardContent>
//                   <Typography variant="h5" className="job-title">
//                     {job.job_title || "Unknown Job Title"}
//                   </Typography>

//                   {/* Required Skills */}
//                   {job.required_skills && job.required_skills.length > 0 ? (
//                     <>
//                       <Typography variant="subtitle2" className="skills-header">
//                         Required Skills:
//                       </Typography>
//                       <Grid container spacing={1}>
//                         {job.required_skills.map((skill, idx) => (
//                           <Grid item key={idx}>
//                             <Chip label={skill} variant="outlined" className="skill-chip" />
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </>
//                   ) : (
//                     <Typography variant="body2" className="no-skills">
//                       No specific skills required.
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Future Opportunities */}
//       <Typography variant="h5" className="section-title">
//         📈 Future Career Opportunities:
//       </Typography>
//       {futureOpportunities.length === 0 ? (
//         <Typography variant="body1" className="no-opportunities">
//           No future job suggestions available.
//         </Typography>
//       ) : (
//         <Grid container spacing={1} className="opportunities-container">
//           {futureOpportunities.map((job, index) => (
//             <Grid item key={index}>
//               <Chip label={job} color="success" className="opportunity-chip" />
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Skills to Learn */}
//       <Typography variant="h5" className="section-title">
//         🎯 Skills to Learn for the Future:
//       </Typography>
//       {skillsToLearn.length === 0 ? (
//         <Typography variant="body1" className="no-skills">
//           No skill recommendations available.
//         </Typography>
//       ) : (
//         <Grid container spacing={1} className="skills-container">
//           {skillsToLearn.map((skill, index) => (
//             <Grid item key={index}>
//               <Chip label={skill} color="warning" className="skill-chip" />
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default JobResults;

// import React from "react";
// import { useLocation } from "react-router-dom";
// import { Container, Card, CardContent, Typography, Grid, Chip } from "@mui/material";

// const JobResults = () => {
//   const location = useLocation();
//   const jobs = location.state?.jobs || [];
//   const futureOpportunities = location.state?.future_opportunities || [];
//   const skillsToLearn = location.state?.skills_to_learn || [];

//   return (
//     <Container maxWidth="md" sx={{ mt: 5 }}>
//       <Typography variant="h4" gutterBottom>
//         Career Insights 🚀
//       </Typography>

//       {/* Eligible Jobs */}
//       <Typography variant="h5" sx={{ mt: 3 }}>
//         ✅ Jobs You Are Eligible For:
//       </Typography>
//       {jobs.length === 0 ? (
//         <Typography variant="h6" color="error">No matching jobs found. Try refining your profile.</Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {jobs.map((job, index) => (
//             <Grid item xs={12} key={index}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <Typography variant="h5" fontWeight="bold">{job.job_title}</Typography>

//                   {/* Required Skills */}
//                   <Typography variant="subtitle2" sx={{ mt: 2 }}>Required Skills:</Typography>
//                   <Grid container spacing={1}>
//                     {job.required_skills.map((skill, idx) => (
//                       <Grid item key={idx}><Chip label={skill} variant="outlined" /></Grid>
//                     ))}
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Future Opportunities */}
//       <Typography variant="h5" sx={{ mt: 4 }}>📈 Future Career Opportunities:</Typography>
//       {futureOpportunities.length === 0 ? (
//         <Typography variant="body1">No future job suggestions available.</Typography>
//       ) : (
//         <Grid container spacing={1} sx={{ mt: 1 }}>
//           {futureOpportunities.map((job, index) => (
//             <Grid item key={index}>
//               <Chip label={job} color="success" />
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Skills to Learn */}
//       <Typography variant="h5" sx={{ mt: 4 }}>🎯 Skills to Learn for the Future:</Typography>
//       {skillsToLearn.length === 0 ? (
//         <Typography variant="body1">No skill recommendations available.</Typography>
//       ) : (
//         <Grid container spacing={1} sx={{ mt: 1 }}>
//           {skillsToLearn.map((skill, index) => (
//             <Grid item key={index}>
//               <Chip label={skill} color="warning" />
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default JobResults;
