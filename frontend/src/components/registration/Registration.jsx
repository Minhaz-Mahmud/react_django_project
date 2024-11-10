import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    skills: "",
    resume: null,
    profile_picture: null,
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("phone_number", formData.phone_number);
    data.append("location", formData.location);
    data.append("skills", formData.skills);
    data.append("password", formData.password);

    if (formData.resume instanceof File) {
      data.append("resume", formData.resume);
    }
    if (formData.profile_picture instanceof File) {
      data.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/candidates/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Candidate created:", response.data);
      setMessage("Candidate created successfully!");
    } catch (error) {
      console.error("Error creating candidate:", error);
      setMessage("Failed to create candidate.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone_number"
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="text"
          name="location"
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <textarea
          name="skills"
          onChange={handleChange}
          placeholder="Skills (comma-separated)"
          required
        ></textarea>

        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <input
          type="file"
          name="resume"
          onChange={handleFileChange}
          accept=".pdf"
        />
        <input
          type="file"
          name="profile_picture"
          onChange={handleFileChange}
          accept="image/*"
        />

        <button type="submit">Submit</button>
      </form>
      {message && (
        <p style={{ color: message.includes("success") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Registration;
