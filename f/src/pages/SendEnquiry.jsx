import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";
import "./SendEnquiry.css";

const SendEnquiry = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    enquiry: "",
    referredBy: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, shopId }),
      });

      if (res.ok) {
        setMessage("Enquiry sent successfully");
        setTimeout(() => navigate(-1), 1500);
      } else {
        setMessage("Failed to send enquiry");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enquiry-page-wrapper">
      <div className="enquiry-card">
        <h2>Send Enquiry</h2>

        <form onSubmit={handleSubmit} className="enquiry-form">
          <div className="enquiry-field">
            <label>Your Name</label>
            <input name="name" required onChange={handleChange} />
          </div>

          <div className="enquiry-field">
            <label>Phone Number</label>
            <input name="phone" required onChange={handleChange} />
          </div>

          <div className="enquiry-field">
            <label>Enquiry Details</label>
            <textarea name="enquiry" rows="4" required onChange={handleChange} />
          </div>

          <div className="enquiry-field">
            <label>Referred By</label>
            <textarea name="referredBy" rows="2" onChange={handleChange} />
          </div>

          <button className="enquiry-submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Enquiry"}
          </button>

          {message && <p className="enquiry-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SendEnquiry;
