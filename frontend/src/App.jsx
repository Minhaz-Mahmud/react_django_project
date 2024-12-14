/* eslint-disable no-unused-vars */
import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import MainHome from "./components/home_components/main_home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Signin from "./components/signin/Signin";
import Registration from "./components/registration/Registration";
import CompanyReg from "./components/registration/company_reg";
import CompanyDashboard from "./components/compnay_dashboard/company_dashboard";
import Dashboard from "./components/candidate_dashboard/Dashboard";
import CompanySignin from "./components/signin/company_signin";
import CompanyProfile from "./components/company_profile/company_profile";
import NavbarComponent from "./components/navbar/navbar";
import FooterComponent from "./components/footer/footer";
import Profile from "./components/profile/Profile";
import PrivateCompanyRoute from "./components/private_routes/PrivateCompanyRoute";
import JobFeed from "./components/job_feed/JobFeed";
import Feed from "./components/feed_candidate/Feed";
import Update from "./components/profile/Update";
import AllCompany from "./components/all_company/AllCompany";

const App = () => {
  const sessionTimeout = 48 * 60 * 60 * 1000; // (2 day) 48 hours in milliseconds

  setTimeout(() => {
    sessionStorage.removeItem("firstRefresh");
    sessionStorage.removeItem("companyData");
    console.log("sessionStorage item removed successfully");
    window.location.href = "/";
  }, sessionTimeout);

  return (
    <div>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route
          path="/registration"
          element={
            <PrivateCompanyRoute>
              {" "}
              <Registration />{" "}
            </PrivateCompanyRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PrivateCompanyRoute>
              <Signin />
            </PrivateCompanyRoute>
          }
        />
        <Route
          path="/company-register"
          element={
            <PrivateCompanyRoute>
              <CompanyReg />
            </PrivateCompanyRoute>
          }
        />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/company-signin"
          element={
            <PrivateCompanyRoute>
              <CompanySignin />
            </PrivateCompanyRoute>
          }
        />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/up_profile" element={<Update />} />
        <Route path="/job-feed" element={<JobFeed />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/all/company" element={<AllCompany />} />
      </Routes>

      <FooterComponent />
    </div>
  );
};

export default App;
