import React, { useState } from 'react';
import axios from 'axios';
import { FilePlus2, Send, Loader2 } from 'lucide-react';
import './CitizenPermitRequest.css';

  const url = "http://localhost:8000";
const PERMIT_TYPES = {
  business: ['business_name', 'location', 'owner_name'],
  construction: ['property_id', 'engineer_name', 'blueprint_number'],
  vehicle: ['plate_number', 'vehicle_type', 'model_year'],
  event: ['event_name', 'event_date', 'expected_crowd'],
};

export function CitizenPermitRequest({ userId }) {
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle dropdown change
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    // Reset data when type changes to prevent cross-contamination
    setFormData({});
  };

  // Handle dynamic input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Ensure all fields for the selected type are filled
    const requiredFields = PERMIT_TYPES[type];
    const isMissingFields = requiredFields.some(field => !formData[field]);

    if (isMissingFields) {
      alert("Please fill in all required fields for this permit type.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        type: type,
        data: formData
      };

      await axios.post(`/api/citizens/${userId}/permits`, payload);
      
      alert("Permit request submitted successfully!");
      // Reset form
      setType('');
      setFormData({});
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit permit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <FilePlus2 color="#2563eb" /> Create New Permit
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>
          Select a permit type and provide the required information.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main Type Selector */}
        <div className="form-group">
          <label className="form-label">Permit Type</label>
          <select 
            className="form-select" 
            value={type} 
            onChange={handleTypeChange}
            required
          >
            <option value="" disabled>Select a permit type...</option>
            <option value="business">Business Permit</option>
            <option value="construction">Construction Permit</option>
            <option value="vehicle">Vehicle Permit</option>
            <option value="event">Event Permit</option>
          </select>
        </div>

        {/* Dynamic Fields Section */}
        {type && (
          <div className="dynamic-fields-area">
            <h3 style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {type} Details
            </h3>
            {PERMIT_TYPES[type].map((field) => (
              <div className="form-group" key={field}>
                <label className="form-label">
                  {field.replace(/_/g, ' ')}
                </label>
                <input
                  className="form-input"
                  type={field.includes('date') ? 'date' : 'text'}
                  placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                  value={formData[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={!type || loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Send size={18} /> Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
}