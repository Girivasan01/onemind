import React from "react";
import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import auth from "../../services/authService";
import "./Admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    auth.logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <nav className="sidebar-nav">
          <Link to="/admin/add-category">Add Category</Link>
          <Link to="/admin/add-location">Add Location</Link>
          <Link to="/admin/add-customer">Add Customer</Link>
          <Link to="/admin/view-join-requests">View Join Requests</Link>
          <Link to="/admin/AdminEnquiries">Enquiry</Link>
        </nav>

        <div style={{ marginTop: 20 }}>
          <button className="admin-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
