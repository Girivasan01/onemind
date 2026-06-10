import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers, deleteCustomer as apiDeleteCustomer } from "../../services/adminService";
import { BASE_URL } from "../../api";
import "./Admin.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load customers");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await apiDeleteCustomer(id);
      alert("Customer deleted");
      loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Error deleting customer");
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Manage Customers</h2>

      <button
        className="admin-btn"
        style={{ marginBottom: 20 }}
        onClick={() => navigate("/admin/customers/new")}
      >
        Add Customer
      </button>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Business Name</th>
              <th>Owner</th>
              <th>Phone</th>
              <th>Category</th>
              <th>Location</th>
              <th>Joined At</th>
              <th>Valid Upto</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: 20 }}>
                  No customers available
                </td>
              </tr>
            ) : (
              customers.map((c, i) => {
                const joinedDate = c.joinedAt ? new Date(c.joinedAt) : null;
                const daysSinceJoined = joinedDate
                  ? Math.floor((new Date() - joinedDate) / (1000 * 60 * 60 * 24))
                  : 0;
                const validUpto = Math.max(0, 365 - daysSinceJoined);
                return (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td>
                      {c.shopPhoto ? (
                        <img
                          src={`${UPLOADS_URL}/${c.shopPhoto}`}
                          alt={c.shopName}
                          style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{c.shopName}</td>
                    <td>{c.ownerName || "—"}</td>
                    <td>{c.shopPhone || "—"}</td>
                    <td>{c.category?.name || "—"}</td>
                    <td>{c.location?.name || "—"}</td>
                    <td>{joinedDate ? joinedDate.toLocaleDateString() : "—"}</td>
                    <td>{validUpto} days</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/customers/edit/${c._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCustomers;
