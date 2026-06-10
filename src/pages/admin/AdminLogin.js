import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import auth from "../../services/authService";
import "./Admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  if (auth.isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.login(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-form-card" style={{ maxWidth: 420, margin: "60px auto" }}>
        <h2 style={{ marginBottom: 12 }}>Admin Login</h2>
        <form onSubmit={submit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-label">Username</label>
            <input className="admin-input" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Password</label>
            <input type="password" className="admin-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: "#ef4444", fontWeight: 600 }}>{error}</div>}
          <div style={{ marginTop: 6 }}>
            <button type="submit" className="admin-btn">Login</button>
          </div>
        </form>
      </div>
      {/* <div className="admin-form-card" style={{ maxWidth: 420, margin: "20px auto", backgroundColor: "#fff3cd", borderColor: "#ffeaa7" }}>
        <h3 style={{ marginBottom: 12 }}>Default Admin Credentials</h3>
        <p><strong>Username:</strong> admin</p>
        <p><strong>Password:</strong> admin123</p>
        <p style={{ fontSize: "14px", color: "#856404" }}>Please change these after first login.</p>
      </div> */}
    </div>
  );
};

export default AdminLogin;
