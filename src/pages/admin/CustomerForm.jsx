import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategories,
  getLocations,
  createCustomer,
  updateCustomer,
} from "../../services/adminService";
import { BASE_URL } from "../../api";
import "./Admin.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    ownerPhone: "",
    shopPhone: "",
    email: "",
    website: "",
    address: "",
    shopDescription: "",
    shopArticle: "",
    category: "",
    location: "",
    joinedAt: "",
  });

  const [shopPhoto, setShopPhoto] = useState(null);
  const [ownerPhoto, setOwnerPhoto] = useState(null);
  const [shopPhotos, setShopPhotos] = useState([]);

  // Existing photos (for edit mode previews)
  const [existingShopPhoto, setExistingShopPhoto] = useState("");
  const [existingOwnerPhoto, setExistingOwnerPhoto] = useState("");
  const [existingShopPhotos, setExistingShopPhotos] = useState([]);

  // Load categories and locations
  useEffect(() => {
    Promise.all([getCategories(), getLocations()])
      .then(([catData, locData]) => {
        setCategories(catData);
        setLocations(locData);
      })
      .catch(console.error);
  }, []);

  // Load customer data in edit mode
  useEffect(() => {
    if (isEdit) {
      const fetchCustomer = async () => {
        try {
          const res = await fetch(`${BASE_URL}/customers/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
          });
          const data = await res.json();
          setForm({
            shopName: data.shopName || "",
            ownerName: data.ownerName || "",
            ownerPhone: data.ownerPhone || "",
            shopPhone: data.shopPhone || "",
            email: data.email || "",
            website: data.website || "",
            address: data.address || "",
            shopDescription: data.shopDescription || "",
            shopArticle: data.shopArticle || "",
            category: data.category?._id || "",
            location: data.location?._id || "",
            joinedAt: data.joinedAt
              ? new Date(data.joinedAt).toISOString().split("T")[0]
              : "",
          });
          setExistingShopPhoto(data.shopPhoto || "");
          setExistingOwnerPhoto(data.ownerPhoto || "");
          setExistingShopPhotos(data.shopPhotos || []);
        } catch (err) {
          console.error(err);
          alert("Failed to load customer");
        }
      };
      fetchCustomer();
    }
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.shopName || !form.category || !form.location) {
      return alert("Please fill Business Name, Category & Location");
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined) data.append(k, v);
      });
      if (shopPhoto) data.append("shopPhoto", shopPhoto);
      if (ownerPhoto) data.append("ownerPhoto", ownerPhoto);
      shopPhotos.forEach((photo) => data.append("shopPhotos", photo));

      if (isEdit) {
        await updateCustomer(id, data);
        alert("Customer updated");
      } else {
        await createCustomer(data);
        alert("Customer added");
      }
      navigate("/admin/customers");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error while saving");
    } finally {
      setSubmitting(false);
    }
  };

  const removeNewShopPhoto = (idx) => {
    setShopPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">
        {isEdit ? "Edit Customer" : "Add Customer"}
      </h2>

      <div className="admin-form-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Business Name */}
          <div className="admin-form-group admin-full">
            <label className="admin-label">Business Name *</label>
            <input
              className="admin-input"
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Enter business name"
              required
            />
          </div>

          {/* Entrepreneur Name */}
          <div className="admin-form-group admin-full">
            <label className="admin-label">Entrepreneur Name</label>
            <input
              className="admin-input"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Enter entrepreneur name"
            />
          </div>

          {/* Phones - 2 column */}
          <div className="admin-form-group">
            <label className="admin-label">Entrepreneur Phone</label>
            <input
              className="admin-input"
              name="ownerPhone"
              value={form.ownerPhone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Business Phone *</label>
            <input
              className="admin-input"
              name="shopPhone"
              value={form.shopPhone}
              onChange={handleChange}
              placeholder="Enter business phone"
              required
            />
          </div>

          {/* Email & Website - 2 column */}
          <div className="admin-form-group">
            <label className="admin-label">Email</label>
            <input
              className="admin-input"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Website</label>
            <input
              className="admin-input"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Enter website URL"
            />
          </div>

          {/* Address */}
          <div className="admin-form-group admin-full">
            <label className="admin-label">Address *</label>
            <textarea
              className="admin-textarea"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows={3}
              style={{ resize: "vertical" }}
              required
            />
          </div>

          {/* Business Description */}
          <div className="admin-form-group admin-full">
            <label className="admin-label">Business Description</label>
            <textarea
              className="admin-textarea"
              name="shopDescription"
              value={form.shopDescription}
              onChange={handleChange}
              placeholder="Enter business description"
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Business Article */}
          <div className="admin-form-group admin-full">
            <label className="admin-label">Business Article</label>
            <textarea
              className="admin-textarea"
              name="shopArticle"
              value={form.shopArticle}
              onChange={handleChange}
              placeholder="Enter business article"
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Category & Location - 2 column */}
          <div className="admin-form-group">
            <label className="admin-label">Category *</label>
            <select
              className="admin-select"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Location *</label>
            <select
              className="admin-select"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Joined At */}
          <div className="admin-form-group">
            <label className="admin-label">Joined At</label>
            <input
              type="date"
              className="admin-input"
              name="joinedAt"
              value={form.joinedAt}
              onChange={handleChange}
            />
          </div>

          {/* Shop Photo */}
          <div className="admin-form-group">
            <label className="admin-label">Shop Photo</label>
            <input
              type="file"
              className="admin-input"
              accept="image/*"
              onChange={(e) => setShopPhoto(e.target.files[0])}
            />
            {/* Existing shop photo preview */}
            {isEdit && existingShopPhoto && !shopPhoto && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={`${UPLOADS_URL}/${existingShopPhoto}`}
                  alt="Current shop"
                  style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6 }}
                />
              </div>
            )}
            {/* New shop photo preview */}
            {shopPhoto && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={URL.createObjectURL(shopPhoto)}
                  alt="New shop"
                  style={{
                    width: 100, height: 70, objectFit: "cover", borderRadius: 6,
                    border: "2px solid #6366f1",
                  }}
                />
              </div>
            )}
          </div>

          {/* Owner Photo */}
          <div className="admin-form-group">
            <label className="admin-label">Owner Photo</label>
            <input
              type="file"
              className="admin-input"
              accept="image/*"
              onChange={(e) => setOwnerPhoto(e.target.files[0])}
            />
            {/* Existing owner photo preview */}
            {isEdit && existingOwnerPhoto && !ownerPhoto && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={`${UPLOADS_URL}/${existingOwnerPhoto}`}
                  alt="Current owner"
                  style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6 }}
                />
              </div>
            )}
            {/* New owner photo preview */}
            {ownerPhoto && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={URL.createObjectURL(ownerPhoto)}
                  alt="New owner"
                  style={{
                    width: 100, height: 70, objectFit: "cover", borderRadius: 6,
                    border: "2px solid #6366f1",
                  }}
                />
              </div>
            )}
          </div>

          {/* Additional Shop Photos */}
          <div className="admin-form-group admin-full">
            <label className="admin-label">Additional Shop Photos (up to 10)</label>
            <input
              type="file"
              className="admin-input"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);
                e.target.value = "";
                if (selectedFiles.length === 0) return;
                setShopPhotos((prev) => {
                  const combined = [...prev, ...selectedFiles];
                  if (combined.length > 10) {
                    alert("Maximum 10 photos allowed. Only the first 10 will be kept.");
                    return combined.slice(0, 10);
                  }
                  return combined;
                });
              }}
            />
            {shopPhotos.length > 0 && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>
                {shopPhotos.length} file(s) selected
              </p>
            )}

            {/* New shop photos previews */}
            {shopPhotos.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                {shopPhotos.map((file, idx) => (
                  <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New photo ${idx + 1}`}
                      style={{
                        width: 100, height: 70, objectFit: "cover", borderRadius: 6,
                        border: "2px solid #6366f1",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewShopPhoto(idx)}
                      style={{
                        position: "absolute", top: -6, right: -6,
                        background: "#e74c3c", color: "#fff", border: "none",
                        borderRadius: "50%", width: 22, height: 22, cursor: "pointer",
                        fontSize: 12, lineHeight: "22px", textAlign: "center",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing shop photos previews */}
            {isEdit && existingShopPhotos.length > 0 && (
              <>
                <label style={{ marginTop: 12, display: "block", fontSize: 13, color: "#555" }}>
                  Existing Photos
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                  {existingShopPhotos.map((photo, idx) => (
                    <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={`${UPLOADS_URL}/${photo}`}
                        alt={`Existing ${idx + 1}`}
                        style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6 }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="admin-full" style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button type="submit" className="admin-btn" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Update Customer" : "Add Customer"}
            </button>
            <button
              type="button"
              className="admin-btn"
              style={{ backgroundColor: "#6c757d" }}
              onClick={() => navigate("/admin/customers")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
