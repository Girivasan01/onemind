import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import "./JoinRequest.css";

const JoinRequest = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  // Removed locations and categories state as they are now input fields
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Removed useEffect as location and category are now input fields

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !mobile || !location || !category) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/join-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          location,
          category,
        }),
      });

      if (res.ok) {
        setMessage("Join request submitted successfully!");
        setName("");
        setMobile("");
        setLocation("");
        setCategory("");
      } else {
        const err = await res.json();
        setMessage(err.message || "Submission failed");
      }
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="joinreq-page">
      <div className="joinreq-card">

        <h2 className="joinreq-title">Join One Mind Market</h2>
        <p className="joinreq-subtitle">
          Become part of a trusted local business ecosystem
        </p>

        <form className="joinreq-form" onSubmit={submit}>

          <div className="joinreq-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="joinreq-field">
            <label>Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="joinreq-field">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
            />
          </div>

          <div className="joinreq-field">
            <label>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Type your Business category here..."
            />
          </div>

          <button className="joinreq-btn" disabled={loading}>
            {loading ? "Submitting..." : "Send Join Request"}
          </button>
        </form>

        {message && <p className="joinreq-message">{message}</p>}
      </div>
    </div>
  );
};

export default JoinRequest;
