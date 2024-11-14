import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./company_reg.css";

const CompanyReg = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [ceoPhone, setCeoPhone] = useState("");
  const [companyType, setCompanyType] = useState("Multinational");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/company/register/",
  //       {
  //         name: companyName,
  //         email: email,
  //         phone_number: phoneNumber,
  //         location: location,
  //         description: companyDescription,
  //         website: website,
  //         ceo_phone: ceoPhone,
  //         company_type: companyType,
  //       }
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       console.log("company created successfully " + email);
  //       toast.clearWaitingQueue();
  //       toast.success("Company registered successfully!");
  //       setTimeout(() => {
  //         navigate("/");
  //       }, 2000);
  //     }
  //   } catch (err) {
  //     if (err.response && err.response.data) {
  //       setError(err.response.data.detail || "Invalid input");
  //       toast.error(err.response.data.detail || "Invalid input");
  //     } else {
  //       setError("An error occurred. Please try again.");
  //       toast.error("An error occurred. Please try again.");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        }
      );

      toast.clearWaitingQueue();
      toast.success("Company registered successfully!");
      setTimeout(() => {
        navigate("/company-dashboard");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        // Check for specific field errors
        const errorData = err.response.data;

        if (errorData.phone_number) {
          setError("Phone Number Error: " + errorData.phone_number);
          toast.error("Phone Number Error: " + errorData.phone_number);
        }
        if (errorData.ceo_phone) {
          setError("CEO phone number error: " + errorData.ceo_phone);
          toast.error("CEO Phone Number Error: " + errorData.ceo_phone);
        } else if (errorData.detail) {
          setError(errorData.detail);
          toast.error(errorData.detail);
        } else {
          setError("Invalid input. Please check your data.");
          toast.error("Invalid input. Please check your data.");
        }
      } else {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="company-reg-container">
      <ToastContainer
        className="toast-class"
        position="top-center"
        autoClose={2000}
      />
      <h2 className="form-title">Company Registration</h2>
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
            placeholder="Add company email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* co phone  */}
        <div className="form-group">
          <label className="form-label">Phone Number:</label>
          <input
            placeholder="Add offical phone number"
            type="tel"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        {/* ceo phone  */}
        <div className="form-group">
          <label className="form-label">CEO Phone Number:</label>
          <input
            placeholder="Add CEO's phone number"
            type="tel"
            className="form-control"
            value={ceoPhone}
            onChange={(e) => setCeoPhone(e.target.value)}
            required
          />
        </div>
        {/* office locations  */}
        <div className="form-group">
          <label className="form-label">Office Location:</label>
          <input
            placeholder="Add company's office location"
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        {/* company description  */}
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
        {/* company website  */}
        <div className="form-group">
          <label className="form-label">Website (Optional):</label>
          <input
            placeholder="Add company's website (optional)"
            pattern="https?://.+"
            title="Please enter a valid URL"
            type="url"
            className="form-control"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        {/* company type  */}
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
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Register Company
        </button>
      </form>
    </div>
  );
};

export default CompanyReg;
