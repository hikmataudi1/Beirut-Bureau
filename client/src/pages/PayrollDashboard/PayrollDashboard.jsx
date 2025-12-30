import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";


const PayrollDashboard = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payroll, setPayroll] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bonus, setBonus] = useState(0);
  const [deduction, setDeduction] = useState(0);
  const [result, setResult] = useState(null);
  
//for downloading the pdf
const downloadReceipt = (data) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Payroll Receipt", 20, 20);

  doc.setFontSize(12);
  doc.text(`Employee: ${data.employee_name}`, 20, 35);
  doc.text(`Month: ${data.month}`, 20, 45);
  doc.text(`Total Hours: ${data.total_hours}`, 20, 55);
  doc.text(`Hourly Rate: $${data.hourly_rate}`, 20, 65);

  doc.line(20, 70, 190, 70);

  doc.text(`Base Pay: $${data.base_pay}`, 20, 80);
  doc.text(`Bonus: $${data.bonus}`, 20, 90);
  doc.text(`Deduction: $${data.deduction}`, 20, 100);

  doc.line(20, 105, 190, 105);

  doc.setFontSize(14);
  doc.text(`Final Pay: $${data.final_pay}`, 20, 120);

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 140);

  doc.save(`Payroll_${data.employee_name}_${data.month}.pdf`);
};


  useEffect(() => {
    fetchPayroll();
  }, [month]);

  const fetchPayroll = async () => {
    const res = await axios.get("http://localhost:8000/api/payroll", {
      params: { month }
    });
    setPayroll(res.data);
  };

  const calculatePayroll = async () => {
    const res = await axios.post(
      `http://localhost:8000/api/payroll/${selected.employee_id}/calculate`,
      { month, bonus, deduction }
    );
    setResult(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>HR Payroll Dashboard</h2>

      <label>
        Month:
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>

      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Total Hours</th>
            <th>Hourly Rate</th>
            <th>Calculated Pay</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payroll.map((p) => (
            <tr key={p.employee_id}>
              <td>{p.employee_name}</td>
              <td>{p.total_hours}</td>
              <td>${p.hourly_rate}</td>
              <td>${p.calculated_pay}</td>
              <td>
                <button onClick={() => {
                  setSelected(p);
                  setBonus(0);
                  setDeduction(0);
                  setResult(null);
                }}>
                  Calculate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div style={{ marginTop: 30, padding: 20, border: "1px solid black" }}>
          <h3>Payroll Calculation: {selected.employee_name}</h3>

          <label>
            Bonus:
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(Number(e.target.value))}
            />
          </label>

          <br />

          <label>
            Deduction:
            <input
              type="number"
              value={deduction}
              onChange={(e) => setDeduction(Number(e.target.value))}
            />
          </label>

          <br /><br />

          <button onClick={calculatePayroll}>Calculate Final Pay</button>

          
        </div>
      )}
      {result && (
  <div style={{ marginTop: 20 }}>
    <p><b>Base Pay:</b> ${result.base_pay}</p>
    <p><b>Bonus:</b> ${result.bonus}</p>
    <p><b>Deduction:</b> ${result.deduction}</p>
    <p><b>Final Pay:</b> ${result.final_pay}</p>

    <button onClick={() => downloadReceipt(result)}>
      Download Receipt (PDF)
    </button>
  </div>
)}

    </div>
  );
};

export default PayrollDashboard;
