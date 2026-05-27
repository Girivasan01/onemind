import React, { useState } from "react";
import { API } from "../api/api";

export default function AddCategory() {
  const [name, setName] = useState("");

  const submit = async () => {
    await fetch(API + "/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    alert("Category added");
  };

  return (
    <div>
      <h2>Add Category</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" />
      <button onClick={submit}>Add</button>
    </div>
  );
}
