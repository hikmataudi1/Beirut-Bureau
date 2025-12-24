import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


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
  <div className="page">
  <h2>Employee Details</h2>

  <div className="card">
    <p><strong>Name:</strong> {employee.user?.name}</p>
    <p><strong>Position:</strong> {employee.position}</p>
    <p><strong>Department:</strong> {employee.department?.name}</p>
    <p><strong>Salary:</strong> {employee.salary}</p>
    <p><strong>Hire Date:</strong> {employee.hire_date}</p>
  </div>
</div>

  );
}
