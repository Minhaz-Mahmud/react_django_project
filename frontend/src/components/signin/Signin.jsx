/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaTimes,
} from "react-icons/fa";
import "./Signin.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
      });

      toast.success("Candidate logged in successfully!", {
        onClose: () => {
          setLoading(false);
          navigate("/dashboard");
        },
      });

      // Save candidate data to session storage
      sessionStorage.setItem(
        "candidateData",
        JSON.stringify(response.data.candidate)
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

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dismissError = () => {
    setError(null);
  };

  return (
    <div className="signin-container">
      <ToastContainer
        className="toast-class text-light"
        position="top-center"
        autoClose={2000}
      />

      <div className="signin-form-container">
        <div className="signin-header">
          <h2>Welcome Back</h2>
          <p>Log in to your candidate account</p>
        </div>

        {error && (
          <div className="company-error-alert">
            <span>{error}</span>
            <button className="error-dismiss-btn" onClick={dismissError}>
              <FaTimes />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <Link to="/cpm" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
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

        <div className="signin-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-signin">
          <button className="social-btn google-btn" onClick={handleGoogleLogin}>
            <FaGoogle /> Google
          </button>
          <button
            className="social-btn facebook-btn"
            onClick={handleFacebookLogin}
          >
            <FaFacebook /> Facebook
          </button>
        </div>

        <div className="signup-option">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/registration">Create Account</Link>
          </p>
        </div>

        <div className="company-signin">
          <Link to="/company-signin" className="company-btn">
            Company Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
