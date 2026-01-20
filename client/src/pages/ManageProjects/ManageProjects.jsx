import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManageProjects.module.css";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete project
  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(projects.filter((p) => p.id !== id));
      alert("Project deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  // Toggle status
  const toggleStatus = async (project) => {
    const nextStatus =
      project.status === "planned"
        ? "ongoing"
        : project.status === "ongoing"
        ? "completed"
        : "planned";

    try {
      const res = await axios.put(
        `http://localhost:8000/api/admin/projects/${project.id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setProjects(projects.map((p) => (p.id === project.id ? res.data.project : p)));
      alert(`Status updated to ${nextStatus}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Manage Projects</h2>
      <table className={styles.projectTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Budget</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No projects found
              </td>
            </tr>
          )}
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.department?.name || "-"}</td>
              <td>{p.budget || "-"}</td>
              <td>{p.start_date || "-"}</td>
              <td>{p.end_date || "-"}</td>
              <td>{p.status}</td>
              <td>
                <button
                  className={styles.statusBtn}
                  onClick={() => toggleStatus(p)}
                >
                  Toggle Status
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteProject(p.id)}
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
