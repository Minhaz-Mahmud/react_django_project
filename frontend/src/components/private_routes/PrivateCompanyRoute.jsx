/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateCompanyRoute = ({ children }) => {
  const companyData = JSON.parse(sessionStorage.getItem("companyData"));

  if (companyData) {
    return <Navigate to="/company/dashboard" />;
  }

  return children;
};

export default PrivateCompanyRoute;
