import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import styles from "./Login.module.css"; // ✅ CSS Module
import { useAuth } from "../../context/AuthContext";


const url = "http://localhost:8000/api";

function Login() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  const schema = yup
    .object({
      email: yup.string().email("invalid email").required("email is required"),
      password: yup.string().required("password is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
const onSubmit = async (val) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/login",
      val,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Save token
    localStorage.setItem("token", res.data.token);

    // Save user (client-side only)
    const user = {
      id: res.data.citizen.user_id,
      citizenId: res.data.citizen.id,
      role: res.data.role,
    };

    login(user, res.data.token);

    navigate("/payroll");
  } catch (err) {
    console.log(err.response?.data?.message || err.message);
  }
};


  // navigation to registration
  const handleReg = () => {
    navigate("/register");
  };

  return (
    <div className={styles.mainDiv}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formLogin}>
        <div className={styles.divInput}>
          <label className={styles.label}>Email Address</label>
          <br />
          <input
            className={styles.inputForm}
            type="email"
            {...register("email")}
            placeholder="example@gmail.com"
          />
          {errors.email && <p className={styles.err}>{errors.email?.message}</p>}
        </div>

        <div className={styles.divInput}>
          <label className={styles.label}>Password</label>
          <br />
          <input
            className={styles.inputForm}
            type="password"
            {...register("password")}
            placeholder="********"
          />
          {errors.password && <p className={styles.err}>{errors.password?.message}</p>}
        </div>

        <button type="submit" className={styles.button}>
          Login
        </button>

        <div>
          <p className={styles.text}>Don't have an account? Register here.</p>
          <button type="button" className={styles.button} onClick={handleReg}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
