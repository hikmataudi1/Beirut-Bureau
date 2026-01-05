import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
   import styles from './AddEmployee.module.css';
const API_URL = "http://localhost:8000/api";

export default function AddEmployee() {
  const positions = [
    "Admin",
    "Mayor",
    "Municipal Director",
    "Finance Officer",
    "Urban Planner",
    "Project Manager",
    "HR Manager",
    "Clerk",
    "Staff",
    "Citizen",
    "Resident",
  ];

  const navigate = useNavigate();
  const [form, setForm] = useState({
    user_id: "",
    position: "",
    department_id: "",
    hire_date: "",
    salary: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/employees`, form);
    navigate("/employees");
  };

  return (


<div className={styles.page}>
  <h2 className={styles.title}>Add Employee</h2>

  <form className={styles.form} onSubmit={handleSubmit}>
    <input
      name="user_id"
      placeholder="User ID"
      value={form.user_id}
      onChange={handleChange}
    />

    <select
      name="position"
      value={form.position}
      onChange={handleChange}
      required
    >
      <option value="">Select Position</option>
      {positions.map((pos) => (
        <option key={pos} value={pos}>
          {pos}
        </option>
      ))}
    </select>

    <input
      name="department_id"
      placeholder="Department ID"
      value={form.department_id}
      onChange={handleChange}
    />

    <input
      type="date"
      name="hire_date"
      value={form.hire_date}
      onChange={handleChange}
    />

    <input
      name="salary"
      placeholder="Salary"
      value={form.salary}
      onChange={handleChange}
    />

    <button type="submit">Save Employee</button>
  </form>
</div>

  );
}
