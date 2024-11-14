import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainHome from "./components/home_components/main_home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Signin from "./components/signin/Signin";
import Registration from "./components/registration/Registration";
import CompanyReg from "./components/registration/company_reg";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/company-register" element={<CompanyReg />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;