import React, { useState, useEffect } from "react";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation as apiDeleteLocation
} from "../../services/adminService";
import "./Admin.css";

const AddLocation = () => {
  const [name, setName] = useState("");
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load all locations
  const loadLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load locations");
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  // Create or Update Location
  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter location name");

    try {
      if (editingId) {
        await updateLocation(editingId, name);
        alert("Location updated");
        setEditingId(null);
      } else {
        await createLocation(name);
        alert("Location added");
      }
      setName("");
      loadLocations(); // Refresh table
    } catch (err) {
      console.error(err);
      alert(err.message || "Server error");
    }
  };

  // Pre-fill form for editing
  const editLocation = (loc) => {
    setName(loc.name);
    setEditingId(loc._id);
  };

  // Delete Location
  const deleteLocation = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await apiDeleteLocation(id);
      alert("Location deleted");
      loadLocations();
    } catch (err) {
      console.error(err);
      alert("Error deleting location");
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Add Location</h2>

      <form onSubmit={submit} className="admin-form">
        <input
          className="admin-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Location name"
        />

        <button type="submit" className="admin-btn">
          {editingId ? "Update Location" : "Add Location"}
        </button>
        {editingId && (
          <button
            type="button"
            className="admin-btn cancel-btn"
            style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="table-title">Available Locations</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Location Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {locations.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: 20 }}>
                No locations available
              </td>
            </tr>
          ) : (
            locations.map((loc, i) => (
              <tr key={loc._id}>
                <td>{i + 1}</td>
                <td>{loc.name}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editLocation(loc)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteLocation(loc._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddLocation;
