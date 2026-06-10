import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../api";

const ViewJoinRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    const token = localStorage.getItem('adminToken');
    fetch(`${BASE_URL}/join-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(r => r.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${BASE_URL}/join-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert('Error deleting request');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Join Requests</h1>
      {requests.length === 0 ? (
        <p style={{ marginTop: 15 }}>No join requests yet.</p>
      ) : (
        <table className="admin-table"  style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Location</th>
              <th>Category</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req.name}</td>
                <td>{req.mobile}</td>
                <td>{req.location || "N/A"}</td>
                <td>{req.category || "N/A"}</td>
                <td>{new Date(req.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(req._id)} className="admin-btn" style={{ backgroundColor: '#dc3545' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewJoinRequests;