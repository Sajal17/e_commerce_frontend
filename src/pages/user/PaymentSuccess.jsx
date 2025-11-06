import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return setError("Invalid order.");
      try {
        const res = await axios.get(`${baseUrl}/orders/${orderId}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <h2 className="text-center mt-20">Loading order...</h2>;
  if (error) return <h2 className="text-center mt-20 text-red-500">{error}</h2>;

  return (
    <main className="pt-20 max-w-4xl mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="mb-6">Your order has been placed successfully.</p>
      <p className="mb-2">Order ID: <span className="font-semibold">{order.id}</span></p>
      <p className="mb-6">Total Paid: ₹ {order.total?.toLocaleString()}</p>

      <Link
        to="/orders"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        View My Orders
      </Link>
    </main>
  );
};

export default PaymentSuccess;
