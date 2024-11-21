/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanySignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/company/login/",
        {
          email,
          password,
        }
      );

      console.log("successful login", response);
      // Show success toast
      toast.success("Company logged in successfully!");

      // Store the token if available (useless)

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      // Store company data in localStorage or sessionStorage
      localStorage.setItem(
        "companyData",
        JSON.stringify(response.data.company)
      );

      setTimeout(() => {
        navigate("/company-profile");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Invalid credentials. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signin-container">
      <ToastContainer
        className="toast-class"
        position="top-center"
        autoClose={2000}
      />
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center">Company Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="text-dark">Email:</label>
              <input
                name="email"
                placeholder="Enter email address"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-dark">Password:</label>
              <input
                placeholder="Please enter password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-dark">
              Register company?
              <Link className="text-primary" to="/company-register">
                {" "}
                Register company
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignin;
