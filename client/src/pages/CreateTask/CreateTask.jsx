import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CreateTask.module.css";

export default function CreateTask() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    project_id: "",
    title: "",
    assignee_id: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch projects and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, empRes] = await Promise.all([
          axios.get("http://localhost:8000/api/projects", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get("http://localhost:8000/api/employees", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setProjects(projRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch projects or employees");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project_id || !form.title) {
      alert("Project and title are required");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/admin/tasks`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`Task created successfully: ${res.data.task.title}`);
      setForm({ project_id: "", title: "", assignee_id: "", start_date: "", end_date: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={styles.formContainer}>
      <h2>Create Task</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Project *
          <select name="project_id" value={form.project_id} onChange={handleChange} required>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Task Title *
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </label>

        <label>
          Assign to Employee
          <select name="assignee_id" value={form.assignee_id} onChange={handleChange}>
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.id} ({e.position})
              </option>
            ))}
          </select>
        </label>

        <label>
          Start Date
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
        </label>

        <label>
          End Date
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
        </label>

        <button type="submit" className={styles.submitBtn}>
          Create Task
        </button>
      </form>
    </div>
  );
}
