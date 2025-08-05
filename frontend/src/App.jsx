/* eslint-disable no-unused-vars */
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
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
import PrivateCompanyRoute from "./components/private_routes/PrivateCompanyRoute";
import PrivateCandidateRoute from "./components/private_routes/PrivateCandidateRoute";
import JobFeed from "./components/job_feed/JobFeed";
import Feed from "./components/feed_candidate/Feed";
import AllCompany from "./components/all_company/AllCompany";
import JobApplications from "./components/job_applications/JobApplications";
import CandidateDetails from "./components/profile/CandidateDetails";
import ResumeBuilder from "./components/resume/ResumeBuilder";
import About from "./components/home_components/about";
import Contact from "./components/home_components/Contact";
import AppliedJobDetails from "./components/candidate_dashboard/cand_applied_job_details/AppliedJobDetails";
import AppliedJobs from "./components/candidate_dashboard/cand_applied_jobs/AppliedJobs";
import ChangePassword from "./components/profile/ChangePassword";
import CPMail from "./components/profile/CPMail";
import CareerOpportunities from "./components/chatbot/CareerOpportunities";
import JobResults from "./components/chatbot/JobResults";
import CPMailCompany from "./components/all_company/CPMailCompany";
import ChangePasswordCompany from "./components/all_company/ChangePasswordCompany";
import JobDetails from "./components/dashboard_components/job_post/JobDetails";
import AdminLogin from "./components/admin_dash/AdminLogin";
import AdminDash from "./components/admin_dash/AdminDash";
import AuthRoute from "./components/private_routes/AuthRoute";
import PrivateAdminRoute from "./components/private_routes/PrivateAdminRoute";

import RecommendedJobs from "./components/job_feed/RecommendedJobs";

const App = () => {
  const sessionTimeout = 48 * 60 * 60 * 1000; // (2 day) 48 hours in milliseconds
  const location = useLocation();

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
            <AuthRoute>
              <Registration />
            </AuthRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <AuthRoute>
              <Signin />
            </AuthRoute>
          }
        />

        <Route
          path="/web/admin/login"
          element={
            <AuthRoute>
              <AdminLogin />
            </AuthRoute>
          }
        />
        <Route
          path="/company-register"
          element={
            <AuthRoute>
              <CompanyReg />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PrivateAdminRoute>
              <AdminDash />
            </PrivateAdminRoute>
          }
        />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route
          path="/applied-job-details/:jobId/:companyId"
          element={
            <PrivateCandidateRoute>
              <AppliedJobDetails />
            </PrivateCandidateRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/company-signin"
          element={
            <AuthRoute>
              <CompanySignin />
            </AuthRoute>
          }
        />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/job-feed" element={<JobFeed />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/all/company" element={<AllCompany />} />

        <Route path="/JA" element={<JobApplications />} />
        <Route
          path="/candidate/apply/details/:candidateId"
          element={<CandidateDetails />}
        />
        <Route
          path="/candidate/build/resume"
          element={
            <PrivateCandidateRoute>
              <ResumeBuilder />
            </PrivateCandidateRoute>
          }
        />
        {/* <Route path="/cp" element={<ChangePassword />} /> */}
        <Route path="/cpm" element={<CPMail />} />

        <Route path="/cp/:id" element={<ChangePassword />} />

        <Route path="/cpm-company" element={<CPMailCompany />} />
        <Route path="/cp-company/:id" element={<ChangePasswordCompany />} />

        <Route path="/CO" element={<CareerOpportunities />} />
        <Route path="/job-results" element={<JobResults />} />

        <Route path="/job-details/:id" element={<JobDetails />} />
        <Route path="/JR" element={<RecommendedJobs />} />
      </Routes>

      {location.pathname !== "/company/dashboard" &&
        !location.pathname.includes("/admin") &&
        location.pathname !== "/dashboard" && <FooterComponent />}
    </div>
  );
};

export default App;
