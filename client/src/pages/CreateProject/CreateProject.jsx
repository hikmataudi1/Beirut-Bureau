import { useState } from "react";
import axios from "axios";
import styles from "./CreateProject.module.css";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    name: "",
    department_id: "",
    budget: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/admin/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Project created successfully!");
      setFormData({
        name: "",
        department_id: "",
        budget: "",
        start_date: "",
        end_date: "",
      });
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to create project");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2>Create New Project</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Project Name*
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project Name"
            required
          />
        </label>

        <label>
          Department ID
          <input
            type="number"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            placeholder="Department ID"
          />
        </label>

        <label>
          Budget
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
            min="0"
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
