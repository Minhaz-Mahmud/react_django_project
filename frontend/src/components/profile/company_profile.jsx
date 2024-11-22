import { useEffect, useState } from "react";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const storedCompanyData = sessionStorage.getItem("companyData");
    if (storedCompanyData) setCompanyData(JSON.parse(storedCompanyData));
    else window.location.href = "/company-signin";
  }, []);

  if (!companyData) return <div>Loading...</div>;

  return (
    <div className="text-dark company-profile">
      <h2>Company Profile</h2>
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {companyData.name}
        </p>
        <p>
          <strong>Email:</strong> {companyData.email}
        </p>
        <p>
          <strong>Location:</strong> {companyData.location}
        </p>
        <p>
          <strong>Company Type:</strong> {companyData.company_type}
        </p>
        <p>
          <strong>Description:</strong> {companyData.description}
        </p>
        <p>
          <strong>Website:</strong> {companyData.website || "Not available"}
        </p>
        <p>
          <strong>CEO Phone:</strong> {companyData.ceo_phone}
        </p>
        <p>
          <strong>Phone Number:</strong> {companyData.phone_number}
        </p>
      </div>
    </div>
  );
};

export default CompanyProfile;
