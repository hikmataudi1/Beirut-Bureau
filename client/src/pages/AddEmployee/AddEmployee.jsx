import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const API_URL = "http://localhost:8000/api";

export default function AddEmployee() {
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
   <div className="page">
  <h2>Add Employee</h2>

  <form className="form" onSubmit={handleSubmit}>
    <input name="user_id" placeholder="User ID" onChange={handleChange} />
    <input name="position" placeholder="Position" onChange={handleChange} />
    <input name="department_id" placeholder="Department ID" onChange={handleChange} />
    <input type="date" name="hire_date" onChange={handleChange} />
    <input name="salary" placeholder="Salary" onChange={handleChange} />

    <button type="submit">Save Employee</button>
  </form>
</div>

  );
}
