import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import "./CertificateRequestsPage.css"; 
const  url = "http://localhost:8000/api";
function CertificateRequestsPage(){
      const { user, token, login, logout } = useAuth();
    const navigate = useNavigate();
    
const  url = "http://localhost:8000/api";


    const  newrequest=()=>{
        navigate("/newRequest");
    } 


    //get Request from db

    const [requests, setRequests] = useState([]);

    
    useEffect (()=>{
        if(user!==null){
            axios.get(url+`/request/citizen/${user.citizenId}`)
            .then(res=>setRequests(res.data))
            .catch(err=>console.error(err));
              
        }
      
    }, [user]);
    

   
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
        <td className="table_cell">{r.id}</td>
        <td className="table_cell">{r.type}</td>
        <td className="table_cell">{r.status}</td>
        <td className="table_cell">{r.submission_date}</td>
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

