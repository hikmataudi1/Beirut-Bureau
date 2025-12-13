import React, { useState } from "react";
import api from "../api";

export default function ServiceRequestForm() {
  const citizenId = 1; // TODO: replace later

  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!type) {
      setMessage("Please select a type.");
      return;
    }

    api
      .post(`/request/${citizenId}`, { type }, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        setMessage("Request submitted successfully.");
        setType("");
      })
      .catch(() => setMessage("Error submitting request."));
  };

  return (
    <div style={{ width: "60%", margin: "30px auto" }}>
      <h2>Submit Service Request</h2>

      {message && <p>{message}</p>}

      <label>Service Type</label>
      <select
        required
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      >
        <option value="">Select type…</option>
        <option value="garbage">Garbage Collection</option>
        <option value="street_repair">Street Repair</option>
        <option value="complaint">Complaint</option>
      </select>

      <button
        onClick={handleSubmit}
        type="button"
        style={{
          padding: "10px",
          width: "100%",
          background: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit Request
      </button>
    </div>
  );
}
