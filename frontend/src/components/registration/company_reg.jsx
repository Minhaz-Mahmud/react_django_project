/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "./company_reg.css";

const CompanyReg = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [ceoPhone, setCeoPhone] = useState("");
  const [companyType, setCompanyType] = useState("Multinational");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.", {
        onClose: () => setLoading(false),
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/company/register/",
        {
          name: companyName,
          email: email,
          phone_number: phoneNumber,
          location: location,
          description: companyDescription,
          website: website,
          ceo_phone: ceoPhone,
          company_type: companyType,
          password: password,
        }
      );

      toast.clearWaitingQueue();
      toast.success("Company registered successfully!", {
        onClose: () => {
          setLoading(false);
          navigate("/company-signin");
        },
      });
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;

        if (errorData.phone_number) {
          setError("Phone Number Error: " + errorData.phone_number);
          toast.error("Phone Number Error: " + errorData.phone_number, {
            onClose: () => setLoading(false),
          });
        }
        if (errorData.ceo_phone) {
          setError("CEO phone number error: " + errorData.ceo_phone);
          toast.error("CEO Phone Number Error: " + errorData.ceo_phone, {
            onClose: () => setLoading(false),
          });
        } else if (errorData.detail) {
          setError(errorData.detail);
          toast.error(errorData.detail, {
            onClose: () => setLoading(false),
          });
        } else {
          setError("Invalid input. Please check your data.");
          toast.error("Invalid input. Please check your data.", {
            onClose: () => setLoading(false),
          });
        }
      } else {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.", {
          onClose: () => setLoading(false),
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="company-reg-bg">
      <div className="company-reg-container">
        <ToastContainer
          className="toast-class text-light"
          position="top-center"
          autoClose={2000}
          style={{ zIndex: 1050 }}
        />
        <h2 className="form-title">Company Registration</h2>
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{ textAlign: "center" }}
            onClick={() => setError(null)}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="company-reg-form">
          {/* co name */}
          <div className="form-group">
            <label className="form-label">Company Name:</label>
            <input
              placeholder="Add company name"
              type="text"
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          {/* co email */}
          <div className="form-group">
            <label className="form-label">Company email:</label>
            <input
              name="email"
              placeholder="Add company email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* co phone */}
          <div className="form-group">
            <label className="form-label">Phone Number:</label>
            <input
              name="phone_number"
              placeholder="Add official phone number"
              type="tel"
              className="form-control"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          {/* ceo phone */}
          <div className="form-group">
            <label className="form-label">CEO Phone Number:</label>
            <input
              name="phone_number"
              placeholder="Add CEO's phone number"
              type="tel"
              className="form-control"
              value={ceoPhone}
              onChange={(e) => setCeoPhone(e.target.value)}
              required
            />
          </div>
          {/* office locations */}
          <div className="form-group">
            <label className="form-label">Office Location:</label>
            <input
              name="location"
              placeholder="Add company's office location"
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          {/* company description */}
          <div className="form-group">
            <label className="form-label">Company Description:</label>
            <textarea
              placeholder="Add company's description"
              className="form-control"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              required
            />
          </div>
          {/* company website */}
          <div className="form-group">
            <label className="form-label">Website (Optional):</label>
            <input
              name="website"
              placeholder="Add company's website (optional)"
              pattern="https?://.+" // Validate URL format
              title="Please enter a valid URL"
              type="url"
              className="form-control"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          {/* company type */}
          <div className="form-group">
            <label className="form-label">Company Type:</label>
            <select
              className="form-control"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              required
            >
              <option className="text-dark" value="Multinational">
                Multinational
              </option>
              <option className="text-dark" value="International">
                International
              </option>
              <option className="text-dark" value="Startup">
                Startup
              </option>
              <option className="text-dark" value="Small Business">
                Small Business
              </option>
            </select>
          </div>
          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password:</label>
            <div className="password-input-container">
              <input
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Confirm Password:</label>
            <div className="password-input-container">
              <input
                placeholder="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="btn btn-primary w-100 mt-3"
          >
            {loading ? (
              <Spinner
                animation="border"
                variant="dark"
                as={"span"}
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Register Company"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyReg;
