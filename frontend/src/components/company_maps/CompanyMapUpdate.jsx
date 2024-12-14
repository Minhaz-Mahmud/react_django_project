/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const GOOGLE_MAPS_API_KEY = "AIzaSyBRgNrmAb8kMGkOIFlJrh4p2JiNtoyLC18";

const CompanyMapUpdate = () => {
  const [latLang, setLatLang] = useState({ latitude: null, longitude: null });
  const [isEditing, setIsEditing] = useState(false);
  const [newLat, setNewLat] = useState("");
  const [newLang, setNewLang] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchLatLang();
  }, []);

  const fetchLatLang = async () => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));

    if (!companyData || !companyData.email) {
      toast.error("Please log in to view location data.");
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/company/location/get-lat-lang/",
        {
          params: { company_email: companyData.email },
        }
      );
      setLatLang(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to fetch location data.";
      toast.error(errorMessage);
    }
  };
  
  const handleUpdateLatLang = async () => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));

    if (!companyData || !companyData.email) {
      toast.error("Please log in to update the location.");
      return;
    }

    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/company/location/update-lat-lang/",
        {
          company_email: companyData.email,
          latitude: newLat,
          longitude: newLang,
        }
      );
      setSuccessMessage(response.data.message);
      setLatLang({ latitude: newLat, longitude: newLang });
      setNewLat("");
      setNewLang("");
      setIsEditing(false);
      toast.success("Location updated successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update location.";
      toast.error(errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  const renderMap = () => {
    if (!latLang.latitude || !latLang.longitude) {
      return <p>No location data available to display on the map.</p>;
    }

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${latLang.latitude},${latLang.longitude}&zoom=14`;

    return (
      <div className="map-container my-3">
        <iframe
          title="Location Map"
          src={mapUrl}
          width="100%"
          height="400"
          // frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
        />
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Location Manager</h2>

      {successMessage ? (
        <div className="alert alert-success alert-dismissible" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setSuccessMessage("")}
          />
        </div>
      ) : errorMessage ? (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setErrorMessage("")}
          />
        </div>
      ) : null}

      <ToastContainer position="top-center" autoClose={1500} />

      {!isEditing ? (
        <div>
          <ul className="list-group mb-4">
            <li className="list-group-item">
              <strong>Latitude: </strong>
              {latLang.latitude !== null ? latLang.latitude : "Not Available"}
            </li>
            <li className="list-group-item">
              <strong>Longitude: </strong>
              {latLang.longitude !== null ? latLang.longitude : "Not Available"}
            </li>
          </ul>

          {renderMap()}

          <button
            className="btn btn-primary w-100"
            onClick={() => setIsEditing(true)}
          >
            Set Latitude and Longitude
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateLatLang();
          }}
        >
          <div className="form-group mb-3">
            <label htmlFor="latitude" className="form-label">
              Latitude
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              className="form-control"
              value={newLat}
              onChange={(e) => setNewLat(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="longitude" className="form-label">
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              className="form-control"
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setNewLat("");
                setNewLang("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyMapUpdate;
