import { useState } from "react";
import axios from "axios";
import styles from "./EditProfile.module.css";
import { useAuth } from "../../context/AuthContext"; 
export default function UpdateCitizen() {
     const { user, token, login, logout } = useAuth();
  const [form, setForm] = useState({
    address: "",
    contact: "",
    date_of_birth: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Remove empty fields (important for PATCH)
    const payload = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== "")
    );

    try {
      await axios.put(
        `http://localhost:8000/api/citizens/update/${user.citizenId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Citizen profile updated successfully");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 403) {
        alert("Unauthorized");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 style={{ color: "#5ba3e8", textAlign: "center" }}>
        Update Citizen Info
      </h2>

      <div>
        <label>Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          onChange={handleChange}
        />
        {errors.address && (
          <div className={styles.error}>{errors.address[0]}</div>
        )}
      </div>

      <div>
        <label>Contact</label>
        <input
          type="text"
          name="contact"
          placeholder="Phone number"
          onChange={handleChange}
        />
        {errors.contact && (
          <div className={styles.error}>{errors.contact[0]}</div>
        )}
      </div>

      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          onChange={handleChange}
        />
        {errors.date_of_birth && (
          <div className={styles.error}>{errors.date_of_birth[0]}</div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
