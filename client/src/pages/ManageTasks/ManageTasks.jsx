import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManageTasks.module.css";

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete a task
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(tasks.filter((t) => t.id !== id));
      alert("Task deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  // Update task status
  const updateStatus = async (task, nextStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/tasks/${task.id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setTasks(tasks.map((t) => (t.id === task.id ? res.data.task : t)));
      alert(`Status updated to ${nextStatus}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const statusOptions = ["pending", "in_progress", "completed", "on_hold"];

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Manage Tasks</h2>
      <table className={styles.taskTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Project</th>
            <th>Assignee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No tasks found
              </td>
            </tr>
          )}
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.project?.name || "-"}</td>
              <td>{task.assignee?.name || "-"}</td>
              <td>{task.start_date || "-"}</td>
              <td>{task.end_date || "-"}</td>
              <td>{task.status}</td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task, e.target.value)}
                  className={styles.statusSelect}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteTask(task.id)}
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
