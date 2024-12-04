// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Pagination,
//   Modal,
// } from "react-bootstrap";
// import { Heart, HeartFill, Star, StarFill } from "react-bootstrap-icons";
// import "./JobFeed.css";

// // Sample job data (replace with your actual data source)
// const initialJobs = [
//   {
//     id: 1,
//     title: "Software Engineer",
//     company: "Tech Innovations Inc.",
//     location: "San Francisco, CA",
//     type: "Full-time",
//     salary: "$120,000 - $150,000",
//     description:
//       "We are seeking a talented Software Engineer to join our dynamic team...",
//     skills: ["React", "JavaScript", "Node.js", "AWS"],
//     isFavorite: false,
//   },
//   {
//     id: 2,
//     title: "Product Manager",
//     company: "Digital Solutions LLC",
//     location: "New York, NY",
//     type: "Full-time",
//     salary: "$110,000 - $140,000",
//     description:
//       "Looking for an experienced Product Manager to lead our product strategy...",
//     skills: ["Agile", "Product Strategy", "User Research"],
//     isFavorite: false,
//   },
//   // Add more job listings...
// ];

// const JobFeed = () => {
//   const [jobs, setJobs] = useState(initialJobs);
//   const [filteredJobs, setFilteredJobs] = useState(initialJobs);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [filters, setFilters] = useState({
//     search: "",
//     location: "",
//     type: "",
//     skills: "",
//   });

//   // Pagination settings
//   const jobsPerPage = 5;
//   const indexOfLastJob = currentPage * jobsPerPage;
//   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//   const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

//   // Filtering logic
//   useEffect(() => {
//     const results = jobs.filter(
//       (job) =>
//         job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
//         (filters.location === "" ||
//           job.location
//             .toLowerCase()
//             .includes(filters.location.toLowerCase())) &&
//         (filters.type === "" || job.type === filters.type) &&
//         (filters.skills === "" ||
//           job.skills.some((skill) =>
//             skill.toLowerCase().includes(filters.skills.toLowerCase())
//           ))
//     );
//     setFilteredJobs(results);
//     setCurrentPage(1);
//   }, [filters, jobs]);

//   // Pagination
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Toggle favorite
//   const toggleFavorite = (jobId) => {
//     setJobs(
//       jobs.map((job) =>
//         job.id === jobId ? { ...job, isFavorite: !job.isFavorite } : job
//       )
//     );
//   };

//   // Open job details modal
//   const openJobDetails = (job) => {
//     setSelectedJob(job);
//   };

//   // Close job details modal
//   const closeJobDetails = () => {
//     setSelectedJob(null);
//   };

//   // Apply to job (placeholder function)
//   const applyToJob = (job) => {
//     alert(`Applied to ${job.title} at ${job.company}`);
//     // Implement actual application logic
//   };

//   return (
//     <Container className="job-feed">
//       {/* Filters */}
//       <Row className="mb-4">
//         <Col md={3}>
//           <Form.Control
//             type="text"
//             placeholder="Search Jobs"
//             value={filters.search}
//             onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Control
//             as="select"
//             value={filters.location}
//             onChange={(e) =>
//               setFilters({ ...filters, location: e.target.value })
//             }
//           >
//             <option value="">All Locations</option>
//             <option value="San Francisco">San Francisco</option>
//             <option value="New York">New York</option>
//           </Form.Control>
//         </Col>
//         <Col md={3}>
//           <Form.Control
//             as="select"
//             value={filters.type}
//             onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//           >
//             <option value="">All Job Types</option>
//             <option value="Full-time">Full-time</option>
//             <option value="Part-time">Part-time</option>
//           </Form.Control>
//         </Col>
//         <Col md={3}>
//           <Form.Control
//             type="text"
//             placeholder="Skills"
//             value={filters.skills}
//             onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
//           />
//         </Col>
//       </Row>

//       {/* Job Listings */}
//       <Row>
//         {currentJobs.map((job) => (
//           <Col md={12} key={job.id} className="mb-3">
//             <Card>
//               <Card.Body>
//                 <Row>
//                   <Col md={10}>
//                     <Card.Title>{job.title}</Card.Title>
//                     <Card.Subtitle className="text-muted mb-2">
//                       {job.company} | {job.location}
//                     </Card.Subtitle>
//                   </Col>
//                   <Col md={2} className="text-right">
//                     <Button
//                       variant="link"
//                       onClick={() => toggleFavorite(job.id)}
//                       className="p-0"
//                     >
//                       {job.isFavorite ? <HeartFill color="red" /> : <Heart />}
//                     </Button>
//                   </Col>
//                 </Row>
//                 <Card.Text>{job.description.substring(0, 150)}...</Card.Text>
//                 <Row>
//                   <Col>
//                     <Button
//                       variant="primary"
//                       onClick={() => openJobDetails(job)}
//                     >
//                       View Details
//                     </Button>
//                     <Button
//                       variant="success"
//                       className="ml-2"
//                       onClick={() => applyToJob(job)}
//                     >
//                       Apply Now
//                     </Button>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* Pagination */}
//       <Row className="justify-content-center">
//         <Pagination>
//           {Array.from({
//             length: Math.ceil(filteredJobs.length / jobsPerPage),
//           }).map((_, index) => (
//             <Pagination.Item
//               key={index}
//               active={index + 1 === currentPage}
//               onClick={() => paginate(index + 1)}
//             >
//               {index + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </Row>

//       {/* Job Details Modal */}
//       {selectedJob && (
//         <Modal show={!!selectedJob} onHide={closeJobDetails} size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>{selectedJob.title}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <h5>
//               {selectedJob.company} | {selectedJob.location}
//             </h5>
//             <p>
//               <strong>Job Type:</strong> {selectedJob.type}
//             </p>
//             <p>
//               <strong>Salary Range:</strong> {selectedJob.salary}
//             </p>
//             <h6>Job Description</h6>
//             <p>{selectedJob.description}</p>
//             <h6>Required Skills</h6>
//             <div>
//               {selectedJob.skills.map((skill, index) => (
//                 <Button
//                   key={index}
//                   variant="outline-secondary"
//                   className="mr-2 mb-2"
//                   size="sm"
//                 >
//                   {skill}
//                 </Button>
//               ))}
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={closeJobDetails}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={() => applyToJob(selectedJob)}>
//               Apply Now
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </Container>
//   );
// };

// export default JobFeed;

function JobFeed() {
  return <div>JobFeed</div>;
}

export default JobFeed;
