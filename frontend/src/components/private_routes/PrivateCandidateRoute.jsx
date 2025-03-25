/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

const PrivateCandidateRoute = ({ children }) => {
  const candidateData = JSON.parse(sessionStorage.getItem("candidateData"));

  if (!candidateData) {
    return (
      <div className="py-5 container text-center mt-5">
        <div className="row">
          <div className="col py-lg-5 height-100vh">
            <h1 className="display-4 text-danger">Error</h1>
            <p className="lead">Candidate data not found. Please log in.</p>
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateCandidateRoute;
