import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./EmployeeDetails.module.css"

const API_URL = "http://localhost:8000/api";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {

    axios.get(`${API_URL}/employees/${id}`)
      .then(res => setEmployee(res.data));
      console.log(employee);

  }, [id]);

  if (!employee) return <p>Loading...</p>;

  return (
    <div className={styles.page}>
 <div className={styles.card}>
  <p><strong>Name:</strong><span>{employee.user?.name}</span></p>
  <p><strong>Position:</strong><span>{employee.position}</span></p>
  <p><strong>Department:</strong><span>{employee.department?.name}</span></p>
  <p><strong>Salary:</strong><span>{employee.salary}</span></p>
  <p><strong>Hire Date:</strong><span>{employee.hire_date}</span></p>
</div>
</div>

  );
}
