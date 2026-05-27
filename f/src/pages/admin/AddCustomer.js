import React, { useEffect, useState } from "react";
import {
    getCategories,
    getLocations,
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer as apiDeleteCustomer
} from "../../services/adminService";
import "./Admin.css";

const AddCustomer = () => {
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [editingId, setEditingId] = useState(null);

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
        joinedAt: ""
    });

    const [shopPhoto, setShopPhoto] = useState(null);
    const [ownerPhoto, setOwnerPhoto] = useState(null);
    const [shopPhotos, setShopPhotos] = useState([]);

    // Load categories, locations, customers
    useEffect(() => {
        Promise.all([getCategories(), getLocations(), getCustomers()])
            .then(([catData, locData, custData]) => {
                setCategories(catData);
                setLocations(locData);
                setCustomers(custData);
            })
            .catch(console.error);
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // Submit or Update
    const submit = async (e) => {
        e.preventDefault();

        if (!form.shopName || !form.category || !form.location) {
            return alert("Please fill Shop Name, Category & Location");
        }

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== undefined) data.append(k, v);
        });
        if (shopPhoto) data.append("shopPhoto", shopPhoto);
        if (ownerPhoto) data.append("ownerPhoto", ownerPhoto);
        shopPhotos.forEach(photo => data.append("shopPhotos", photo));

        try {
            if (editingId) {
                await updateCustomer(editingId, data);
                alert("Customer updated");
            } else {
                await createCustomer(data);
                alert("Customer added");
            }
            resetForm();
            loadCustomers();
        } catch (err) {
            console.error(err);
            alert(err.message || "Error while saving");
        }
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm("Delete this customer?")) return;

        try {
            await apiDeleteCustomer(id);
            alert("Customer deleted");
            loadCustomers();
        } catch (err) {
            console.error(err);
            alert("Error deleting");
        }
    };

    const editCustomer = (c) => {
        setEditingId(c._id);
        setForm({
            shopName: c.shopName || "",
            ownerName: c.ownerName || "",
            ownerPhone: c.ownerPhone || "",
            shopPhone: c.shopPhone || "",
            email: c.email || "",
            website: c.website || "",
            address: c.address || "",
            shopDescription: c.shopDescription || "",
            shopArticle: c.shopArticle || "",
            category: c.category?._id || "",
            location: c.location?._id || "",
            joinedAt: c.joinedAt ? new Date(c.joinedAt).toISOString().split('T')[0] : "",
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
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
            joinedAt: ""
        });
        setShopPhoto(null);
        setOwnerPhoto(null);
        setShopPhotos([]);
    };

    return (
        <div className="admin-page">

            <h2 className="admin-title">
                {editingId ? "Edit Customer" : "Add Customer Details"}
            </h2>

            <div className="admin-form-card">
                <form className="admin-form" onSubmit={submit}>

                    {/* Shop Name */}
                    <div className="admin-form-group admin-full">
                        <label className="admin-label">Business Name *</label>
                        <input
                            className="admin-input"
                            name="shopName"
                            value={form.shopName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Owner Name */}
                    <div className="admin-form-group admin-full">
                        <label className="admin-label">Entrepreneur  Name</label>
                        <input
                            className="admin-input"
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Owner & Shop Phone */}
                    <div className="admin-form-group">
                        <label className="admin-label">Entrepreneur  Phone</label>
                        <input
                            className="admin-input"
                            name="ownerPhone"
                            value={form.ownerPhone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-label">Business Phone *</label>
                        <input
                            className="admin-input"
                            name="shopPhone"
                            value={form.shopPhone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="admin-form-group admin-full">
                        <label className="admin-label">Email</label>
                        <input
                            className="admin-input"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Website */}
                    <div className="admin-form-group admin-full">
                        <label className="admin-label">Website</label>
                        <input
                            className="admin-input"
                            name="website"
                            value={form.website}
                            onChange={handleChange}
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
                            required
                        />
                    </div>

                    {/* Shop Description */}
                    <div className="admin-form-group admin-full">
                        <label className="admin-label">Business Description</label>
                        <textarea
                            className="admin-textarea"
                            name="shopDescription"
                            value={form.shopDescription}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Shop Article */}
                    <div className="admin-form-group admin-full">
                        <label className="admin-label">Business Article</label>
                        <textarea
                            className="admin-textarea"
                            name="shopArticle"
                            value={form.shopArticle}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Category */}
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
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
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
                            {locations.map(l => (
                                <option key={l._id} value={l._id}>{l.name}</option>
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

                    {/* Photos */}
                    <div className="admin-form-group">
                        <label className="admin-label">Shop Photo</label>
                        <input
                            type="file"
                            className="admin-input"
                            accept="image/*"
                            onChange={(e) => setShopPhoto(e.target.files[0])}
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-label">Owner Photo</label>
                        <input
                            type="file"
                            className="admin-input"
                            accept="image/*"
                            onChange={(e) => setOwnerPhoto(e.target.files[0])}
                        />
                    </div>

                    <div className="admin-form-group admin-full">
                        <label className="admin-label">Additional Shop Photos (up to 10)</label>
                        <input
                            type="file"
                            className="admin-input"
                            accept="image/*"
                            multiple
                            onChange={(e) => setShopPhotos(Array.from(e.target.files || []))}
                        />
                        {shopPhotos.length > 0 && <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{shopPhotos.length} file(s) selected</p>}
                    </div>

                    <div className="admin-full" style={{ marginTop: "10px" }}>
                        <button className="admin-btn" type="submit">
                            {editingId ? "Update Customer" : "Add Customer"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="admin-btn cancel-btn"
                                onClick={resetForm}
                                style={{ background: "#6c757d", marginLeft: "10px" }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h3 className="admin-subtitle">Customer List</h3>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Business Name</th>
                            <th>Owner</th>
                            <th>Phone</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Article</th>
                            <th>Joined at</th>
                            <th>Valid Upto</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map((c) => {
                            const joinedDate = c.joinedAt ? new Date(c.joinedAt) : null;
                            const daysSinceJoined = joinedDate ? Math.floor((new Date() - joinedDate) / (1000 * 60 * 60 * 24)) : 0;
                            const validUpto = Math.max(0, 365 - daysSinceJoined);
                            return (
                                <tr key={c._id}>
                                    <td>{c.shopName}</td>
                                    <td>{c.ownerName || "-"}</td>
                                    <td>{c.shopPhone || "-"}</td>
                                    <td>{c.category?.name}</td>
                                    <td>{c.location?.name}</td>
                                    <td>{c.shopDescription || "-"}</td>
                                    <td>{c.shopArticle || "-"}</td>
                                    <td>{joinedDate ? joinedDate.toLocaleDateString() : "-"}</td>
                                    <td>{validUpto} days</td>
                                    <td>
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => editCustomer(c)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => deleteCustomer(c._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default AddCustomer;
