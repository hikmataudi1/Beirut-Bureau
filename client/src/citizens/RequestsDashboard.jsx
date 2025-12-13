import React, { useState, useEffect } from "react";
import api from "../api";

export default function RequestsDashboard() {
  const citizenId = 1; // TODO: replace later

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");

  const fetchRequests = () => {
    setLoading(true);

    api
      .get(`/request/citizen/${citizenId}`, {
        params: {
          status: status || undefined,
          type: type || undefined,
          date: date || undefined,
        },
      })
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Load first time
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ width: "90%", margin: "30px auto" }}>
      <h2>My Requests</h2>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Types</option>
          <option value="garbage">Garbage Collection</option>
          <option value="street_repair">Street Repair</option>
          <option value="complaint">Complaint</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "8px" }}
        />

        <button
          onClick={fetchRequests}
          style={{ padding: "8px 15px", background: "#2563eb", color: "white" }}
        >
          Apply
        </button>

        <button
          onClick={() => {
            setStatus("");
            setType("");
            setDate("");
            fetchRequests();
          }}
          style={{ padding: "8px 15px", background: "#6b7280", color: "white" }}
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table width="100%" border="1" cellPadding="10">
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No results
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.type}</td>
                  <td>{r.status}</td>
                  <td>{r.submission_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
