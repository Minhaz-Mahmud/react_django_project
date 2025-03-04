/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./company_signin.css";

const CompanySignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/company/login/",
        {
          email,
          password,
        }
      );

      toast.success("Company logged in successfully!", {
        onClose: () => {
          setLoading(false);
          navigate("/company/dashboard");
        },
      });

      sessionStorage.setItem(
        "companyData",
        JSON.stringify(response.data.company)
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Invalid credentials. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        onClose: () => setLoading(false),
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dismissError = () => {
    setError(null);
  };

  return (
    <div className="company-signin-container">
      <ToastContainer
        className="toast-class"
        position="top-center"
        autoClose={2000}
      />

      <div className="company-signin-form-wrapper">
        <div className="company-signin-header">
          <h2>Company Portal</h2>
          <p>Sign in to access your company dashboard</p>
        </div>
        {error && (
          <div className="company-error-alert">
            <span>{error}</span>
            <button className="error-dismiss-btn" onClick={dismissError}>
              <FaTimes />
            </button>
          </div>
        )}
        <form onSubmit={handleLogin} className="company-signin-form">
          <div className="form-group">
            <label htmlFor="company-email">Email Address</label>
            <input
              id="company-email"
              name="email"
              placeholder="Enter your company email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-password">Password</label>
            <div className="password-field-container">
              <input
                id="company-password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="forgot-password-link">
            <Link to="/company/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="company-signin-button"
            disabled={loading}
          >
            {loading ? (
              <Spinner
                animation="border"
                variant="light"
                as={"span"}
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="company-registration-section">
          <p>
            Don&apos;t have a company account?
            <Link to="/company-register"> Register your company</Link>
          </p>
        </div>

        <div className="candidate-redirect-section">
          <Link to="/signin" className="candidate-signin-link">
            Are you a candidate? Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanySignin;
