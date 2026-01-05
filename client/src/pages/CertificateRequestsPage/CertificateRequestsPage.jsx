import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import styles from './CertificateRequestsPage.module.css';
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


<div className={styles.mainDiv}>
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Request Number</th>
          <th>Type</th>
          <th>Status</th>
          <th>Date</th>
          
        </tr>
      </thead>

      <tbody>
        {requests.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.type}</td>
            <td>{r.status}</td>
            <td>{r.submission_date}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <button className={styles.button_new_request} onClick={newrequest}>
    New Request
  </button>
</div>

    )

}

export default CertificateRequestsPage;

