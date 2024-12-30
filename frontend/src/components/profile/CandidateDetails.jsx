import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/candidates/${candidateId}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch candidate details.");
        }
        const data = await response.json();
        setCandidateDetails(data);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [candidateId]);

  const defaultProfilePicture = "profile.jpg";
  const profileImage = candidateDetails?.profile_picture
    ? `http://localhost:8000${candidateDetails.profile_picture}`
    : defaultProfilePicture;
  const resumeLink = candidateDetails?.resume
    ? `http://localhost:8000${candidateDetails.resume}`
    : null;

  return (
    <div className="candidate-details-container">
      <br />
      <br />
      <br />
      <br />
      <h4>Candidate Details</h4>
      {loading ? (
        <p>Loading...</p>
      ) : candidateDetails ? (
        <div>
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              backgroundImage: `url(${profileImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: "20px",
            }}
          ></div>
          <p>
            <strong>Full Name:</strong> {candidateDetails.full_name}
          </p>
          <p>
            <strong>Email:</strong> {candidateDetails.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {candidateDetails.phone_number}
          </p>
          <p>
            <strong>Location:</strong> {candidateDetails.location}
          </p>
          <p>
            <strong>Skills:</strong> {candidateDetails.skills.join(", ")}
          </p>
          <p>
            <strong>Resume:</strong>{" "}
            {resumeLink ? (
              <a href={resumeLink} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>
      ) : (
        <p>No details found.</p>
      )}
    </div>
  );
};

export default CandidateDetails;



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const CandidateDetails = () => {
//   const { candidateId } = useParams();
//   const [candidateDetails, setCandidateDetails] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCandidateDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:8000/candidates/${candidateId}/`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch candidate details.");
//         }
//         const data = await response.json();
//         setCandidateDetails(data);
//       } catch (error) {
//         console.error("Error fetching candidate details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCandidateDetails();
//   }, [candidateId]);

//   return (
//     <div className="candidate-details-container">
//         <br /><br /><br /><br />
//       <h4>Candidate Details</h4>
//       {loading ? (
//         <p>Loading...</p>
//       ) : candidateDetails ? (
//         <div>
//           <p>
//             <strong>Full Name:</strong> {candidateDetails.full_name}
//           </p>
//           <p>
//             <strong>Email:</strong> {candidateDetails.email}
//           </p>
//           <p>
//             <strong>Phone Number:</strong> {candidateDetails.phone_number}
//           </p>
//           <p>
//             <strong>Location:</strong> {candidateDetails.location}
//           </p>
//           <p>
//             <strong>Skills:</strong> {candidateDetails.skills.join(", ")}
//           </p>
//           {candidateDetails.profile_picture && (
//             <div>
//               <strong>Profile Picture:</strong>
//               <br />
//               <img
//                 src={candidateDetails.profile_picture}
//                 alt="Profile"
//                 style={{ width: "150px", height: "150px", borderRadius: "50%" }}
//               />
//             </div>
//           )}
//           {candidateDetails.resume && (
//             <div>
//               <strong>Resume:</strong>
//               <br />
//               <a href={candidateDetails.resume} target="_blank" rel="noopener noreferrer">
//                 View Resume
//               </a>
//             </div>
//           )}
//         </div>
//       ) : (
//         <p>No details found.</p>
//       )}
//     </div>
//   );
// };

// export default CandidateDetails;
