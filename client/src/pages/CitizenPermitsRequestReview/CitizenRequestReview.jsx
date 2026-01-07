import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PermitRequestCard } from './CitizenRequestCard';
import { FileCheck, ClipboardList, Loader2 } from 'lucide-react';
import './permitStyle.css';


export function PermitRequestReview() {
  const url = "http://localhost:8000";
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPermits();
  }, []);

  const fetchPendingPermits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/admin/permits/pending`,{
         headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: "application/json",
    },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching permits:", error);
      alert("Failed to load permit requests.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Universal status updater
   * @param {string|number} permitId 
   * @param {string} status - "accepted" | "rejected"
   */
  const updatePermitStatus = async (permitId, status) => {
    try {
      // API Call with the body format you specified
      await axios.put(`${url}/api/admin/permits/${permitId}`, {
        status: status
      },{ headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: "application/json",
    },});

      // Remove the permit from the list upon success
      setRequests(prev => prev.filter(r => r.permit_id !== permitId));
      
      alert(`Permit #${permitId} has been ${status}.`);
    } catch (error) {
      console.error(`Error updating permit to ${status}:`, error);
      alert(`Failed to update permit status to ${status}.`);
    }
  };

  const handleAccept = (permitId) => updatePermitStatus(permitId, 'accepted');
  const handleReject = (permitId) => updatePermitStatus(permitId, 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header-container">
        <div className="header-content">
          <div className="flex-row" style={{ gap: '1rem' }}>
            <div style={{ padding: '0.6rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.75rem' }}>
              <FileCheck size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Review Portal</h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Decision Management</p>
            </div>
          </div>
          <span className="custom-badge badge-secondary">
            <ClipboardList size={16} /> {requests.length} Pending
          </span>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto', color: '#2563eb' }} />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Fetching applications...</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
            <FileCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <h2>Queue Empty</h2>
            <p>No new permits require review at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <PermitRequestCard 
                key={request.permit_id} 
                request={request} 
                onAccept={handleAccept} 
                onReject={handleReject} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}