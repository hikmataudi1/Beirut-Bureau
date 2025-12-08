import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mockRequests from "../../api/mockData/requests.json";
import axios from "axios";


function Viewrequest(){
    const { id } = useParams();
    const [request, setRequest]=useState(null);

    useEffect(() => {
    // Mock: جلب الطلب حسب الـID
    const r = mockRequests.find(r => r.id === parseInt(id));
    setRequest(r);
    }, [id]);


    const  handleDownloadPDF=async()=>{

        try {
            const response =await axios.get (`/requests/${id}/pdf`,{
                responseType: "blob",
                
            });

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);

            const link = document.createElement("a");
            link.href =fileURL ;
            link.download = `certificate_${id}.pdf`;
            link.click();
            URL.revokeObjectURL(fileURL);
        }catch(error){
            console.error("PDF download failed:", error);
        }
    };

    if (!request) return <div>Loading...</div>;

    return(<div>
    <div>   
    <h1 className="headr">View Request Details</h1>
    </div> 
    <div>
    <p  className="data_Request"><strong>Request Number:</strong> {request.request_number}</p>
    <p className="data_Request"><strong>Type:</strong> {request.certificate_type}</p>
    <p className="data_Request"><strong>Status:</strong> {request.status}</p>
    <p className="data_Request"><strong>Submitted At:</strong> {request.submitted_at}</p>
    </div>
    <div>
    <h2>Documents</h2>
    {request.document_paths ? (
        <ul>
        {request.document_paths.map((doc, index) => (
            <li key={index}>
            <a href={doc} target="_blank" rel="noopener noreferrer">{doc}</a>
            </li>
        ))}
        </ul>
    ) : (
        <p>No documents uploaded.</p>
        )}
    </div>
    <div>
        <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
    </div>
    );

}
export default Viewrequest ;