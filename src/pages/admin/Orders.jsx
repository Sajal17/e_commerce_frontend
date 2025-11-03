// src/pages/admin/Orders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../redux/orderSlice";
import Loader from "./components/Loader";
import AdminLayout from "./components/AdminLayout";

const Orders = () => {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2">₹ {order.totalPrice}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Orders;
