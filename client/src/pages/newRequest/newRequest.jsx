import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./NewRequest.css";

const schema = yup.object({
  type: yup.string().required("Type is required"),
  requestType: yup.string().required("Request type is required"),
});

export default function NewRequest() {
  const { user } = useAuth();
 const  url = "http://localhost:8000/api";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!user) return;
    let formattedData = {
        type:data.requestType,
    }
    console.log(formattedData);
       axios.post(url+`/request/${user.citizenId}`,formattedData).then(res => console.log(res))
      .catch(err =>console.log(err));
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Type</label>
      <select {...register("type")}>
        <option value="">Select type</option>
        <option value="certificate">Certificate</option>
        <option value="service">Service</option>
      </select>
      {errors.type && <span className="error">{errors.type.message}</span>}

      <label>Request Type</label>
      <input
        type="text"
        {...register("requestType")}
        placeholder="e.g. Birth certificate, Residency proof"
      />
      {errors.requestType && (
        <span className="error">{errors.requestType.message}</span>
      )}

      <button type="submit">Submit Request</button>
    </form>
  );
}