import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const candidateData = sessionStorage.getItem("candidateData");
  const companyData = sessionStorage.getItem("companyData");
  const adminData = sessionStorage.getItem("AdminData");

  if (candidateData) {
    return <Navigate to="/dashboard" />;
  } else if (companyData) {
    return <Navigate to="/company/dashboard" />;
  } else if (adminData) {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default AuthRoute;
