import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManagePermits.module.css";

export default function ManagePermits() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch pending permits
  const fetchPermits = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/permits/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPermits(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch permits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  // Approve / Reject permit
  const decidePermit = async (permitId, status) => {
    setUpdatingId(permitId);
    try {
      const res = await axios.put(
        `http://localhost:8000/api/admin/permits/${permitId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPermits(permits.filter((p) => p.permit_id !== permitId));
      alert(`Permit ${status} successfully`);
    } catch (err) {
      console.error(err);
      alert("Failed to update permit status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Optional: Delete permit
  const deletePermit = async (permitId) => {
    if (!window.confirm("Are you sure you want to delete this permit?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/permits/${permitId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPermits(permits.filter((p) => p.permit_id !== permitId));
      alert("Permit deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete permit");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={styles.tableContainer}>
      <h2 style={{ color: "#5ba3e8", textAlign: "center" }}>Pending Permits</h2>
      <table className={styles.permitTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Submitted Data</th>
            <th>Applicant</th>
            <th>Submitted At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No pending permits</td>
            </tr>
          )}
          {permits.map((permit) => (
            <tr key={permit.permit_id}>
              <td>{permit.permit_id}</td>
              <td>{permit.type}</td>
              <td>
                <pre style={{ maxWidth: "250px", overflowX: "auto" }}>
                  {JSON.stringify(permit.submitted_data, null, 2)}
                </pre>
              </td>
              <td>
                {permit.applicant.name}<br />
                {permit.applicant.email}<br />
                {permit.applicant.contact}
              </td>
              <td>{new Date(permit.submitted_at).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.approveBtn}
                  onClick={() => decidePermit(permit.permit_id, "accepted")}
                  disabled={updatingId === permit.permit_id}
                >
                  Approve
                </button>
                <button
                  className={styles.rejectBtn}
                  onClick={() => decidePermit(permit.permit_id, "rejected")}
                  disabled={updatingId === permit.permit_id}
                >
                  Reject
                </button>
              
                <button
                  className={styles.deleteBtn}
                  onClick={() => deletePermit(permit.permit_id)}
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
