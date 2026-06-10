import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../api";
import "./AdminEnquiries.css";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [clearing, setClearing] = useState(false);

  const fetchEnquiries = () => {
    fetch(`${BASE_URL}/enquiries`)
      .then(r => r.json())
      .then(setEnquiries)
      .catch(console.error);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const clearEnquiries = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all enquiry history? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setClearing(true);
      const res = await fetch(`${BASE_URL}/delete-enquiry`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEnquiries([]);
        alert("Enquiry history cleared successfully.");
      } else {
        alert("Failed to clear enquiry history.");
      }
    } catch (err) {
      alert("Network error while clearing enquiries.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="admin-enquiry-page">
      <div className="admin-enquiry-header">
        <h2>Customer Enquiries</h2>

        <button
          className="admin-clear-btn"
          onClick={clearEnquiries}
          disabled={clearing || enquiries.length === 0}
        >
          {clearing ? "Clearing..." : "Clear Enquiry History"}
        </button>
      </div>

      {enquiries.length === 0 ? (
        <div className="admin-enquiry-empty">
          No enquiries available
        </div>
      ) : (
        <table className="admin-enquiry-table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Enquiry</th>
              <th>Referred By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(e => (
              <tr key={e._id}>
                <td>{e.shop?.shopName}</td>
                <td>{e.name}</td>
                <td>{e.phone}</td>
                <td>{e.enquiry}</td>
                <td>{e.referredBy}</td>
                <td>{new Date(e.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminEnquiries;
