import { jsPDF } from "jspdf";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PaymentReview.module.css"
const API_BASE = "http://localhost:8000/api";

const generateReceipt = async (paymentId) => {
  try {
    const response = await axios.get(`${API_BASE}/payments/${paymentId}`);
    const payment = response.data;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Property Tax Receipt", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Receipt ID: ${payment.payment_id}`, 20, 40);
    doc.text(`Citizen Name: ${payment.citizen.name}`, 20, 50);
    doc.text(`Citizen Email: ${payment.citizen.email}`, 20, 60);
    doc.text(`Citizen Contact: ${payment.citizen.contact}`, 20, 70);
    doc.text(`Amount Paid: $${payment.amount.toFixed(2)}`, 20, 80);
    doc.text(`Payment Type: ${payment.payment_type}`, 20, 90);
    doc.text(
      `Payment Date: ${payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "-"}`,
      20,
      100
    );
    doc.text(`Status: ${payment.status}`, 20, 110);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 20, 120);

    doc.rect(15, 15, 180, 120);
    doc.save(`${payment.payment_type}_receipt_${payment.payment_id}.pdf`);
  } catch (error) {
    console.error("Receipt generation error:", error);
    alert("Failed to generate receipt");
  }
};


export function PaymentReview() {
  const userId = 1; 
  const [propertyTaxes, setPropertyTaxes] = useState([]);

  useEffect(() => {
    const fetchPropertyTaxes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/property-tax/${userId}`);
        setPropertyTaxes(response.data.payments);
      } catch (error) {
        console.error("Error fetching property taxes:", error);
      }
    };

    fetchPropertyTaxes();
  }, [userId]);

  const payTax = async (paymentId) => {
    try {
      const response = await axios.post(`${API_BASE}/property-tax/pay`, {
        paymentId,
        userId,
      });

      if (response.data.status === "SUCCESS") {
        setPropertyTaxes((prev) =>
          prev.map((tax) =>
            tax.id === paymentId
              ? {
                  ...tax,
                  status: "PAID",
                  date: response.data.paidAt,
                }
              : tax
          )
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const generateReceiptTrigger = async (paymentId) => {
    try {
      generateReceipt(paymentId);
    } catch (error) {
      console.error("Receipt error:", error);
    }
  };

  return (

<div className={styles.paymentContainer}>
  <h2>Property Tax Payments</h2>

  <div className={styles.paymentTableWrapper}>
    <table className={styles.paymentTable}>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Payment Type</th>
          <th>Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {propertyTaxes.map((tax) => (
          <tr key={tax.id}>
            <td>${tax.amount.toFixed(2)}</td>
            <td>{tax.payment_type}</td>
            <td>{tax.date ? new Date(tax.date).toLocaleString() : "-"}</td>
            <td className={tax.status === "PAID" ? styles.paid : styles.unpaid}>
              {tax.status}
            </td>
            <td>
              {tax.status === "UNPAID" ? (
                <button
                  className={styles.payBtn}
                  onClick={() => payTax(tax.id)}
                >
                  Pay
                </button>
              ) : (
                <>
                  <span>PAID</span>
                  <br />
                  <button
                    className={styles.receiptBtn}
                    onClick={() => generateReceiptTrigger(tax.id)}
                  >
                    Generate Receipt
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}
