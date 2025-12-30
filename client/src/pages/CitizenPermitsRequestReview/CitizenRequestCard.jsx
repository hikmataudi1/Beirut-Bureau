import React from 'react';
import { 
  Building2, Briefcase, Calendar, Truck, User, 
  Mail, Phone, MapPin, Check, X, Clock 
} from 'lucide-react';
import './permitStyle.css';

const permitTypeConfig = {
  building: { label: 'Building Permit', icon: <Building2 size={14} />, variant: 'badge-building' },
  business: { label: 'Business License', icon: <Briefcase size={14} />, variant: 'badge-business' },
  event: { label: 'Event Permit', icon: <Calendar size={14} />, variant: 'badge-event' },
  vehicle: { label: 'Vehicle Permit', icon: <Truck size={14} />, variant: 'badge-vehicle' },
};

export function PermitRequestCard({ request, onAccept, onReject }) {
  // Map 'type' from API to our config
  const typeConfig = permitTypeConfig[request.type] || permitTypeConfig.building;

  return (
    <div className="custom-card">
      <div className="card-header">
        <div className="flex-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="flex-row" style={{ gap: '0.75rem', marginBottom: '4px' }}>
              <span className="text-bold" style={{ fontSize: '1.1rem' }}>#{request.permit_id}</span>
              <span className={`custom-badge ${typeConfig.variant}`}>
                {typeConfig.icon} {typeConfig.label}
              </span>
            </div>
            <div className="flex-row text-muted">
              <Clock size={14} style={{ marginRight: '4px' }} /> 
              {new Date(request.submitted_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="info-section">
          <h4 className="flex-row text-bold" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <User size={16} style={{ marginRight: '8px', color: '#2563eb' }} /> Applicant Details
          </h4>
          <div className="grid-2">
            <div>
              <div className="text-bold">{request.applicant.name}</div>
              <div className="text-muted flex-row"><Mail size={12} style={{marginRight: '5px'}}/> {request.applicant.email}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-muted flex-row" style={{ justifyContent: 'flex-end' }}>
                <Phone size={12} style={{marginRight: '5px'}}/> {request.applicant.contact}
              </div>
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button className="custom-btn btn-reject" onClick={() => onReject(request.permit_id)}>
            <X size={16} style={{ marginRight: '6px' }} /> Reject
          </button>
          <button className="custom-btn btn-accept" onClick={() => onAccept(request.permit_id)}>
            <Check size={16} style={{ marginRight: '6px' }} /> Approve
          </button>
        </div>
      </div>
    </div>
  );
}