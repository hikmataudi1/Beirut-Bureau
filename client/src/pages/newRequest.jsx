import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios';

const schema = yup.object({
    certificateType: yup.string().required("Certificate type is required"),
    fullName: yup.string().required("Full Name is required"),
    nationalId: yup.string().required("National ID is required"),
}).required();

function NewRequest() {
    const [files, setFiles] = useState([]);

    const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
    });

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const onSubmit = async (data) => {
    try {
        const formData = new FormData();
        formData.append("certificateType", data.certificateType);
        formData.append("fullName", data.fullName);
        formData.append("nationalId", data.nationalId);
        formData.append("eventDate", data.eventDate || "");
        formData.append("notes", data.notes || "");

        Array.from(files).forEach(file => {
        formData.append("documents[]", file);
        });

        console.log("Submitting form with files:", formData);


        // axios 
        const response = await axios.post('/api/certificates', formData, {
        headers: {
        'Content-Type': 'multipart/form-data', },
        });

    
        console.log('Server response:', response.data);
        alert('Request submitted successfully!');
    }catch (error) {
    console.error('Submission failed:', error);
    alert('Failed to submit request. Check console for details.');
    }}



    return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <label>certificate Type</label>
        <select {...register("certificateType")}>
        <option value="">Select certificate</option>
        <option value="residency">Residency</option>
        <option value="birth">Birth</option>
        <option value="death">Death</option>
        <option value="marriage">Marriage</option>
        </select>
        <p>{errors.certificateType?.message}</p>

        <label>Full Name</label>
        <input type="text" {...register("fullName")} placeholder="Full Name" />
        <p>{errors.fullName?.message}</p>

        <label>National ID</label>
        <input type="text" {...register("nationalId")} placeholder="National ID" />
        <p>{errors.nationalId?.message}</p>

        <label>Notes</label>
        <input type="date" {...register("eventDate")} />
        <textarea {...register("notes")} rows="3" placeholder="Notes"></textarea>

        <input type="file" onChange={handleFileChange} multiple />

        <button type="submit">Submit Request</button>
    </form>
    );
}

export default NewRequest;
