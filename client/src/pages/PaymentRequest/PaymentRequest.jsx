import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentRequest.css";

const API_BASE = "http://localhost:8000/api";

export function PaymentRequest() {
  const [citizens, setCitizens] = useState([]);
  const [filteredCitizens, setFilteredCitizens] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/citizens`).then(res => setCitizens(res.data));
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCitizens(citizens);
    } else {
      setFilteredCitizens(
        citizens.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, citizens]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedIds([]);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !amount) {
      alert("Type and Amount are required");
      return;
    }
    if (selectedIds.length === 0 && !selectAll) {
      alert("At least 1 citizen is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        paymen_type:type,
        amount: parseFloat(amount),
        citizen_id: selectAll ? [] : selectedIds,
      };

      console.log(payload);
    //   await axios.post(`${API_BASE}/admin/property-tax`, payload);
      alert(
        `Payment created for ${selectAll ? "All" : selectedIds.length} successfully!`
      );
      setType("");
      setAmount("");
      setSelectAll(false);
      setSelectedIds([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-payment-container">
      <h2>Create Payment</h2>
      <form onSubmit={handleSubmit} className="admin-payment-form">
        <label>
          Payment Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <div className="citizen-selection">
          <label className="select-all">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            Select All Citizens
          </label>

          {!selectAll && (
            <>
              <input
                type="text"
                placeholder="Search by name..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <table className="citizens-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCitizens.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c.id)}
                          onChange={() => handleCheckboxChange(c.id)}
                        />
                      </td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Payment"}
        </button>
      </form>
    </div>
  );
}
