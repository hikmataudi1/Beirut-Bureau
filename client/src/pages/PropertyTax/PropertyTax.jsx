import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";


const  url = "http://localhost:8000/api";
function PropertyTax() {


    // ues context 
    const { user } = useAuth(); 
    const userId = user?.id; 
    
    const [propertyTaxes, setPropertyTaxes] = useState([]);

    useEffect(() => {
        const fetchPropertyTaxes = async () => {
            try {
                const response = await axios.get(url+`/property-tax/${userId}`);
                setPropertyTaxes(response.data);
            } catch (error) {
                console.error("Error fetching property taxes:", error);
            }
        };

        fetchPropertyTaxes();
    }, [userId]);

    const payTax = async (paymentId) => {
        try {
            const response = await axios.post("/api/property-tax/pay", {
                paymentId: paymentId,
                userId: userId,
            });

            if (response.data.status === "SUCCESS") {
                setPropertyTaxes(prev =>
                    prev.map(tax =>
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

    const generateReceipt = async (paymentId) => {
        try {
            const response = await axios.post(`/api/payments/${paymentId}`);
            console.log("Receipt data:", response.data);
            alert("Receipt generated (check console)");
        } catch (error) {
            console.error("Receipt error:", error);
        }
    };

    return (
        <>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>amount</th>
                            <th>payment_type</th>
                            <th>date</th>
                            <th>status</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propertyTaxes.map((tax) => (
                            <tr key={tax.id}>
                                <td>{tax.amount}</td>
                                <td>{tax.payment_type}</td>
                                <td>
                                    {tax.date
                                        ? new Date(tax.date).toLocaleString()
                                        : "-"}
                                </td>
                                <td>{tax.status}</td>
                                <td>
                                    {tax.status === "UNPAID" ? (
                                        <button onClick={() => payTax(tax.id)}>
                                            Pay
                                        </button>
                                    ) : (
                                        <>
                                            <span>PAID</span>
                                            <br />
                                            <button
                                                onClick={() =>
                                                    generateReceipt(tax.id)
                                                }
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
        </>
    );
}

export default PropertyTax;
