import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import styles from "./PerformanceOverviewDashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const COLORS = {
  Excellent: "#4CAF50",
  Good: "#FFC107",
  Average: "#FF9800",
  Poor: "#F44336",
};

const PerformanceOverviewDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    // Fetch all employees for dropdown
    axios.get("http://localhost:8000/api/employees",{
       headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: "application/json",
    },
    }).then(res => {
        console.log(res.data)
      setEmployees(res.data);
      if (res.data.length > 0) setSelectedEmployee(res.data[0].id);
    });
  }, []);

  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    if (selectedEmployee) fetchPerformance(selectedEmployee, month);
  }, [selectedEmployee, month]);

  const fetchPerformance = async (employeeId, month) => {
    const res = await axios.get(
      `http://localhost:8000/api/employee-performance/${employeeId}`,
      { params: { month } , headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: "application/json",
    },}
    );
    setPerformance(res.data);
  };

  if (!performance) return <p>Loading...</p>;

  // Charts
  const attendanceChartData = {
    labels: ["Attendance"],
    datasets: [
      {
        label: "Hours Worked",
        data: [performance.total_hours],
        backgroundColor: "#673AB7",
      },
      {
        label: "Expected Hours",
        data: [performance.total_hours > 0 ? 8 * 30 : 240], // approx month
        backgroundColor: "#BDBDBD",
      },
    ],
  };

  const taskChartData = {
    labels: ["Tasks"],
    datasets: [
      {
        label: "Completed Tasks",
        data: [performance.completed_tasks],
        backgroundColor: "#4CAF50",
      },
      {
        label: "Total Tasks",
        data: [performance.total_tasks],
        backgroundColor: "#BDBDBD",
      },
    ],
  };

  const statusChartData = {
    labels: [performance.status],
    datasets: [
      {
        data: [performance.overall_score],
        backgroundColor: [COLORS[performance.status]],
      },
    ],
  };

  return (
   
<div className={styles.dashboard}>
  <h2>Employee Performance Dashboard</h2>

  <div className={styles.controls}>
    <label>
      Select Employee:
      <select
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.id}
          </option>
        ))}
      </select>
    </label>

    <label>
      Month:
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
    </label>
  </div>

  <div className={styles.chartsRow}>
    <div className={styles.chartContainer}>
      <h3>Attendance Hours</h3>
      <Bar data={attendanceChartData} options={{ responsive: true }} />
    </div>

    <div className={styles.chartContainer}>
      <h3>Task Completion</h3>
      <Bar data={taskChartData} options={{ responsive: true }} />
    </div>

    <div className={`${styles.chartContainer} ${styles.pieChart}`}>
      <h3>Overall Performance</h3>
      <Pie
        data={statusChartData}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  </div>

  <div className={styles.tableContainer}>
    <h3>Task Details</h3>
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        {performance.tasks.map((t, idx) => (
          <tr key={idx}>
            <td>{t.title}</td>
            <td className="status">{t.status}</td>
            <td>{t.start_date}</td>
            <td>{t.end_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default PerformanceOverviewDashboard;
