import { useState } from "react";
import axios from "axios";
import styles from './AttendancesEdit.module.css';
const AttendancesEdit = ({ attendance, onSave, onCancel }) => {
  const [checkIn, setCheckIn] = useState(attendance.check_in?.slice(0,5) || "");
  const [checkOut, setCheckOut] = useState(attendance.check_out?.slice(0,5) || "");

  const handleSave = async () => {
    // Validation before sending
    if (!checkIn || !checkOut) {
      alert("Check-in and check-out cannot be empty");
      return;
    }

    // Format to HH:MM:SS
    const formattedCheckIn = checkIn.includes(":") ? checkIn + ":00" : checkIn;
    const formattedCheckOut = checkOut.includes(":") ? checkOut + ":00" : checkOut;

    try {
      // Send PUT request
      await axios.put(`http://localhost:8000/api/attendance/${attendance.id}`, {
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
      });

      // Calculate hours worked for frontend
      const hoursWorked = ((new Date(`1970-01-01T${formattedCheckOut}`) - new Date(`1970-01-01T${formattedCheckIn}`)) / 3600000).toFixed(2);

      // Update parent state
      onSave({ ...attendance, check_in: formattedCheckIn, check_out: formattedCheckOut, hours_worked: parseFloat(hoursWorked) });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        alert("Validation failed. Make sure the times are valid HH:MM format.");
      } else {
        alert("Failed to update attendance.");
      }
    }
  };

  return (


<div className={styles.modal}>
  <h3>Edit Attendance ID: {attendance.id}</h3>

  <label>
    Check In:
    <input
      type="time"
      value={checkIn}
      onChange={(e) => setCheckIn(e.target.value)}
    />
  </label>

  <label>
    Check Out:
    <input
      type="time"
      value={checkOut}
      onChange={(e) => setCheckOut(e.target.value)}
    />
  </label>

  <div>
    <button className={styles.saveBtn} onClick={handleSave}>Save</button>
    <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
  </div>
</div>

  );
};

export default AttendancesEdit;
