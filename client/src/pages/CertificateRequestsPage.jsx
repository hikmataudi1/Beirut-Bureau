import React, { useEffect } from "react";
import axios from "axios";
import mockRequests from "../api/mockData/requests.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CertificateRequestsPage.css"; 

function CertificateRequestsPage(){

    const navigate = useNavigate();



    const  newrequest=()=>{
        navigate("/newRequest");
    }


    //get Request from db

    const [requests, setRequests] = useState([]);

    
    // useEffect (()=>{
    // axios.get(`/serviceRequest/citizen/${citizenId}`)
    // .then(res=>setRequests(res.data))
    // .catch(err=>console.error(err));
    // }, []);
    

    // Load mock data directly

    useEffect (()=>{
        setRequests(mockRequests);
    },[]);

    return (
        <>
        <table>
    <thead>
        <tr>
            <th>Request Number</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>
    {requests.map(r => (
    <tr key={r.id}>
        <td>{r.request_number}</td>
        <td>{r.certificate_type}</td>
        <td>{r.status}</td>
        <td>{r.submitted_at}</td>
        <td><button onClick={() => navigate(`/Viewrequest/${r.id}`)}>View</button></td>
    </tr>
    ))}
    </tbody>

</table>

        <button onClick={newrequest}>new Request</button>
        </>
    )

}
export default CertificateRequestsPage;
