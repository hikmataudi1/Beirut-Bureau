import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManageRequests.module.css";

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/requests", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Delete request
  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRequests(requests.filter((r) => r.id !== id));
      alert("Request deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete request");
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/request/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setRequests(requests.map((r) => (r.id === id ? res.data.request : r)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={styles.tableContainer}>
      <h2 style={{ color: "#5ba3e8", textAlign: "center" }}>Manage Requests</h2>
      <table className={styles.requestTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Citizen ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Submission Date</th>
            <th>Completion Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No requests found</td>
            </tr>
          )}
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.citizen_id}</td>
              <td>{req.type}</td>
              <td className={
                req.status === "approved"
                  ? styles.approved
                  : req.status === "rejected"
                  ? styles.rejected
                  : styles.pending
              }>
                {req.status}
              </td>
              <td>{new Date(req.submission_date).toLocaleDateString()}</td>
              <td>{req.completion_date ? new Date(req.completion_date).toLocaleDateString() : "-"}</td>
              <td>
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value)}
                  disabled={updatingId === req.id}
                  className={styles.statusSelect}
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteRequest(req.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
