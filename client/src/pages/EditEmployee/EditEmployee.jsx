import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./EditEmployee.module.css"

const API_URL = "http://localhost:8000/api";

export default function EditEmployee() {

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

  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/employees/${id}`)
      .then(res => setForm(res.data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/employees/${id}`, form);
    navigate("/employees");
  };

  return (


<div className={styles.page}>


  <form className={styles.form} onSubmit={handleSubmit}>
    <p>Current position: {form.position}</p>

    <select
      name="position"
      value={form.position || ""}
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
      value={form.department_id || ""}
      onChange={handleChange}
      placeholder="Department ID"
    />

    <input
      type="date"
      name="hire_date"
      value={form.hire_date || ""}
      onChange={handleChange}
    />

    <input
      name="salary"
      value={form.salary || ""}
      onChange={handleChange}
      placeholder="Salary"
    />

    <button type="submit">Update Employee</button>
  </form>
</div>


  );
}
