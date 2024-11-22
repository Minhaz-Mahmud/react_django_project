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
import CompanySignin from "./components/signin/company_signin";
import CompanyProfile from "./components/profile/company_profile";
import NavbarComponent from "./components/navbar/navbar";
import FooterComponent from "./components/footer/footer";

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
        <Route path="/registration" element={<Registration />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/company-register" element={<CompanyReg />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company-signin" element={<CompanySignin />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
      </Routes>
      <FooterComponent />
    </div>
  );
};

export default App;
