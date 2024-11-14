import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signin.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        console.log("Success response from server");
        toast.clearWaitingQueue();
        toast.success("Login successful!");

        // Redirect to home page after a delay
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail);
        toast.error(err.response.data.detail);
      } else {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
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
          <h2 className="text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-dark">Email:</label>
              <input
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
            <div className="form-group d-flex justify-content-between">
              <div>
                <label className="text-dark checkbox-wrap checkbox-primary">
                  Remember Me
                  <input
                    className="checkbox-class-input"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div>
                <a
                  href="/forgot-password"
                  className="text-decoration-none text-danger"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-dark">
              New here? <Link to="/registration"> Sign up</Link>
            </p>
          </div>

          <p className="w-100 text-center text-dark">
            &mdash; Or Sign In With &mdash;
          </p>
          <div className="social d-flex justify-content-center">
            <button
              className="btn btn-danger px-2 py-2 mr-md-1 rounded"
              onClick={handleGoogleLogin}
            >
              <i className="fab fa-google mr-2"></i> Google
            </button>
            <button
              className="btn btn-primary px-2 py-2 ml-md-1 rounded"
              onClick={handleFacebookLogin}
            >
              <i className="fab fa-facebook-f mr-2"></i> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
