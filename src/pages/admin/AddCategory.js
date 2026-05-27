import React, { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory as apiDeleteCategory
} from "../../services/adminService";
import "./Admin.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all categories
  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Create or Update Category
  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter category name");

    try {
      if (editingId) {
        await updateCategory(editingId, name);
        alert("Category updated");
        setEditingId(null);
      } else {
        await createCategory(name);
        alert("Category added");
      }
      setName("");
      loadCategories(); // refresh table
    } catch (err) {
      console.error(err);
      alert(err.message || "Server error");
    }
  };

  // Edit Category
  const editCategory = (c) => {
    setName(c.name);
    setEditingId(c._id);
  };

  // Delete Category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await apiDeleteCategory(id);
      alert("Category deleted");
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Add Category</h2>

      <form onSubmit={submit} className="admin-form">
        <input
          className="admin-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />

        <button type="submit" className="admin-btn">
          {editingId ? "Update Category" : "Add Category"}
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

      <h3 className="table-title">Available Categories</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: 20 }}>
                No categories available
              </td>
            </tr>
          ) : (
            categories.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editCategory(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteCategory(c._id)}
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

export default AddCategory;
