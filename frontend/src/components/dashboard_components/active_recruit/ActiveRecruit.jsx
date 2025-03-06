import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "./ActiveRecruit.css";

function ActiveRecruit() {
  const [recruits, setRecruits] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    fetchActiveRecruit();
  }, []);

  const fetchActiveRecruit = async () => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));
    if (!companyData || !companyData.id) {
      toast.error("Please log in to view your jobs.");
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get-active-recruitment-status/",
        { params: { company_id: companyData.id } }
      );
      setRecruits(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to fetch jobs.";
      toast.error(errorMessage);
    }
  };

  const handleCheckboxChange = (id) => {
    setRecruits((prevRecruits) =>
      prevRecruits.map((recruit) =>
        recruit.id === id
          ? { ...recruit, active_recruiting: !recruit.active_recruiting }
          : recruit
      )
    );
    setIsUpdated(true);
  };

  const handleUpdate = async () => {
    const companyData = JSON.parse(sessionStorage.getItem("companyData"));
    if (!companyData || !companyData.id) {
      toast.error("Please log in to update your jobs.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/update-active-recruitment-status/",
        {
          company_id: companyData.id,
          recruits: recruits,
        }
      );
      toast.success("Recruitment status updated successfully!");
      setIsUpdated(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update recruitment status.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container-fluid active-recruit-div">
      <ToastContainer />
      <h2 className="text-center mb-4 text-light">Active Recruitment</h2>

      {/* Responsive Table Container */}
      <div className="table-responsive">
        <Table striped bordered hover className="text-center">
          <thead className="table-dark">
            <tr>
              <th>SL</th>
              <th>Job Title</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {recruits.map((recruit, index) => (
              <tr key={recruit.id}>
                <td>{index + 1}</td>
                <td>{recruit.title}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={recruit.active_recruiting}
                    onChange={() => handleCheckboxChange(recruit.id)}
                    className="recruit-checkbox"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {isUpdated && (
        <div className="d-flex justify-content-center">
          <Button onClick={handleUpdate} className="mt-3">
            Update Recruitment Status
          </Button>
        </div>
      )}
    </div>
  );
}

export default ActiveRecruit;
