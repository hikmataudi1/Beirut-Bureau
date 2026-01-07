import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CitizenRegistration.module.css"; // ✅ CSS Module import

function CitizenRegistration() {
  const navigate = useNavigate();

  // Validation Schema
  const schema = yup
    .object({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email format").required("Email is required"),
      password: yup.string().required("Password is required"),
      contact: yup
        .string()
        .matches(/^[0-9]+$/, "The phone number must contain only digits")
        .min(8, "Phone number must be at least 8 digits")
        .required("Contact number is required"),
      national_id: yup.string().required("National id is required"),
      date_of_birth: yup
        .date()
        .typeError("Date of birth must be a valid date")
        .required("Date of birth is required")
        .max(new Date(), "Date of birth cannot be in the future")
        .min(new Date(1900, 0, 1), "Date of birth is too old")
        .test("age", "You must be at least 18 years old", (value) => {
          if (!value) return false;
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          const month = today.getMonth() - value.getMonth();
          const day = today.getDate() - value.getDate();
          return age > 18 || (age === 18 && month >= 0 && day >= 0);
        }),
    })
    .required();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Submit handler
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      date_of_birth: data.date_of_birth.toISOString().split("T")[0],
    };
    try {
  await axios.post(
    "http://127.0.0.1:8000/api/citizens",
    formattedData,
    { headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: "application/json",
    },}
    
  );

  toast.success("Registration Successful! Redirecting...");
  setTimeout(() => navigate("/login"), 2000);
} catch (err) {
  toast.error(err.response?.data?.message || err.message);
}
  };

  return (
    <div className={styles.divMain}>
      <div className={styles.formContainer}>
        <h2 className={styles.header}>Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formRegistration}>
          {/* Left Column */}
          <div className={styles.div_}>
            <div>
              <label className={styles.label}>User Name</label>
              <input
                type="text"
                {...register("name")}
                className={styles.inputForm}
                placeholder="Your name"
              />
              {errors.name && <p className={styles.err}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                {...register("email")}
                className={styles.inputForm}
                placeholder="example@gmail.com"
              />
              {errors.email && <p className={styles.err}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                {...register("password")}
                className={styles.inputForm}
                placeholder="********"
              />
              {errors.password && <p className={styles.err}>{errors.password.message}</p>}
            </div>

            <div>
              <label className={styles.label}>National ID</label>
              <input
                type="text"
                {...register("national_id")}
                className={styles.inputForm}
                placeholder="11223344"
              />
              {errors.national_id && <p className={styles.err}>{errors.national_id.message}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.div_}>
            <div>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                {...register("contact")}
                className={styles.inputForm}
                placeholder="70123456"
              />
              {errors.contact && <p className={styles.err}>{errors.contact.message}</p>}
            </div>

            <div>
              <label className={styles.label}>Date of Birth</label>
              <input
                type="date"
                {...register("date_of_birth")}
                className={styles.inputForm}
              />
              {errors.date_of_birth && <p className={styles.err}>{errors.date_of_birth.message}</p>}
            </div>

            <div>
              <label className={styles.label}>Address</label>
              <input
                type="text"
                {...register("address")}
                className={styles.inputForm}
                placeholder="Address"
              />
            </div>

            <div className={styles.div_2}>
              <button type="submit" className={styles.button}>
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CitizenRegistration;
