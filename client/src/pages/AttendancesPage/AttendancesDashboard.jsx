import { useState, useEffect } from "react";
import axios from "axios";
import AttendacesEdit from "../AttendancesEdit/AttendacesEdit";
  import styles from './AttendancesDashboard.module.css';
const AttendancesDashboard = () => {

  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ employeeId: "", date: "" });
  const [editRecord, setEditRecord] = useState(null);

  // Fetch employees and attendance on load
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch employees");
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/attendance");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance records");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAttendance = attendance.filter((a) => {
    return (
      (!filters.employeeId || a.employee_id === parseInt(filters.employeeId)) &&
      (!filters.date || a.date === filters.date)
    );
  });

  const handleEdit = (record) => setEditRecord(record);

  const handleSaveEdit = async (updatedRecord) => {
    try {
      await axios.put(`http://localhost:8000/api/attendance/${updatedRecord.id}`, {
        check_in: updatedRecord.check_in,
        check_out: updatedRecord.check_out,
        hours_worked: updatedRecord.hours_worked,
      });
      setAttendance(attendance.map((a) => (a.id === updatedRecord.id ? updatedRecord : a)));
      setEditRecord(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/attendance/${id}`);
      setAttendance(attendance.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete attendance record");
    }
  };

 const totalHours = filteredAttendance.reduce((sum, a) => sum + (parseFloat(a.hours_worked) || 0), 0);
  const totalRecords = filteredAttendance.length;

  return (
  

<div className={styles.page}>
  <h1 className={styles.title}>HR Attendance Dashboard</h1>

  <div className={styles.filters}>
    <label>
      Employee:
      <select
        name="employeeId"
        value={filters.employeeId}
        onChange={handleFilterChange}
      >
        <option value="">All</option>
        {employees.map((e) => (
          <option key={e.id} value={e.id}>
            {e.user?.name || e.name}
          </option>
        ))}
      </select>
    </label>

    <label>
      Date:
      <input
        type="date"
        name="date"
        value={filters.date}
        onChange={handleFilterChange}
      />
    </label>
  </div>

  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Employee</th>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Hours Worked</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredAttendance.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.employee_name || a.employee?.user?.name}</td>
            <td>{a.date}</td>
            <td>{a.check_in}</td>
            <td>{a.check_out}</td>
            <td>{a.hours_worked}</td>
            <td className={styles.actions}>
              <button className={styles.actionLink} onClick={() => handleEdit(a)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(a.id)}>Delete</button>
            </td>
          </tr>
        ))}
        {filteredAttendance.length === 0 && (
          <tr>
            <td colSpan="7" className={styles.noRecords}>No records found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
    {/* Edit Modal */}
      {editRecord && (
        <AttendacesEdit
          attendance={editRecord}
          onSave={handleSaveEdit}
          onCancel={() => setEditRecord(null)}
        />
      )}
</div>


  );
};

export default AttendancesDashboard;
