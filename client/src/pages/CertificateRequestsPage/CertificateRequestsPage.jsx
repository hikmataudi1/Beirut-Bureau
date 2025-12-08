import React, { useEffect } from "react";
import axios from "axios";
import mockRequests from "../../api/mockData/requests.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CertificateRequestsPage.css"; 
const  url = "http://localhost:8000/api";
function CertificateRequestsPage(){

    const navigate = useNavigate();



    const  newrequest=()=>{
        navigate("/newRequest");
    }


    //get Request from db

    const [requests, setRequests] = useState([]);

    
    // useEffect (()=>{
    // axios.get(url+`/serviceRequest/citizen/${citizenId}`)
    // .then(res=>setRequests(res.data))
    // .catch(err=>console.error(err));
    // }, []);
    

    // Load mock data directly

    useEffect (()=>{
        setRequests(mockRequests);
    },[]);

    return (
        <>
        <div className="_main_div">
        <table className="table_Request">
    <thead>
        <tr className="table_row">
            <th className="table_head">Request Number</th>
            <th className="table_head">Type</th>
            <th className="table_head">Status</th>
            <th className="table_head">Date</th>
            <th className="table_head">Actions</th>
        </tr>
    </thead>

    <tbody className="tale_body">
    {requests.map(r => (
    <tr key={r.id} className="table_row">
        <td className="table_cell">{r.request_number}</td>
        <td className="table_cell">{r.certificate_type}</td>
        <td className="table_cell">{r.status}</td>
        <td className="table_cell">{r.submitted_at}</td>
        <td className="table_cell"><button className="button_view" onClick={() => navigate(url+`/Viewrequest/${r.id}`)}>View</button></td>
    </tr>
    ))}
    </tbody>

</table>

        <button onClick={newrequest} className="button_new_request">new Request</button>
        </div>
        </>

    )

}

export default CertificateRequestsPage;

