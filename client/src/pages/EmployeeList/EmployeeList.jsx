import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./EmployeeList.module.css";


const API_URL = "http://localhost:8000/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const loadEmployees = async () => {
    const res = await axios.get(`${API_URL}/employees`);
    setEmployees(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete employee?")) return;
    await axios.delete(`${API_URL}/employees/${id}`);
    loadEmployees();
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
   <div className={styles.page}>
  <h2 className={styles.title}>Employees</h2>

  <a className={styles.addBtn} href="/employees/add">
    + Add Employee
  </a>

  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.user?.name}</td>
            <td>{emp.position}</td>
            <td>{emp.department?.name}</td>
            <td className={styles.actions}>
              <a
                className={styles.actionLink}
                href={`/employees/${emp.id}`}
              >
                View
              </a>
              <a
                className={styles.actionLink}
                href={`/employees/edit/${emp.id}`}
              >
                Edit
              </a>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(emp.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


  );
}
