// src/pages/admin/Payments.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayments } from "../../store/adminSlice"; // Replace with your store/action

const Payments = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-20">Loading payments...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Payment Method</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.orderId}</td>
              <td className="border p-2">{p.userName}</td>
              <td className="border p-2">₹ {p.amount.toLocaleString()}</td>
              <td className="border p-2">{p.method}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2">{new Date(p.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
