import { BASE_URL } from "../api";
import auth from "./authService";

// Helper to handle responses
const handleResponse = async (res) => {
    if (res.ok) {
        // For 204 No Content (if any), return null
        if (res.status === 204) return null;
        return res.json();
    } else if (res.status === 401) {
        // Token expired or invalid, logout and redirect to login
        auth.logoutAndRedirect();
        throw new Error("Session expired. Redirecting to login...");
    } else {
        const err = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(err.message || "Request failed");
    }
};

const authHeaders = (extra = {}) => {
    const token = auth.getToken && auth.getToken();
    const headers = { ...extra };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

// --- Categories ---
export const getCategories = async () => {
    const res = await fetch(`${BASE_URL}/categories`, { headers: authHeaders() });
    return handleResponse(res);
};

export const createCategory = async (name) => {
    const res = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name }),
    });
    return handleResponse(res);
};

export const updateCategory = async (id, name) => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name }),
    });
    return handleResponse(res);
};

export const deleteCategory = async (id) => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
};

// --- Locations ---
export const getLocations = async () => {
    const res = await fetch(`${BASE_URL}/locations`, { headers: authHeaders() });
    return handleResponse(res);
};

export const createLocation = async (name) => {
    const res = await fetch(`${BASE_URL}/locations`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name }),
    });
    return handleResponse(res);
};

export const updateLocation = async (id, name) => {
    const res = await fetch(`${BASE_URL}/locations/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name }),
    });
    return handleResponse(res);
};

export const deleteLocation = async (id) => {
    const res = await fetch(`${BASE_URL}/locations/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
};

// --- Customers ---
export const getCustomers = async () => {
    const res = await fetch(`${BASE_URL}/customers`, { headers: authHeaders() });
    return handleResponse(res);
};

export const createCustomer = async (formData) => {
    const res = await fetch(`${BASE_URL}/customers`, {
        method: "POST",
        body: formData, // FormData handles Content-Type automatically
        headers: authHeaders(),
    });
    return handleResponse(res);
};

export const updateCustomer = async (id, formData) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
        method: "PUT",
        body: formData,
        headers: authHeaders(),
    });
    return handleResponse(res);
};

export const deleteCustomer = async (id) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
};
