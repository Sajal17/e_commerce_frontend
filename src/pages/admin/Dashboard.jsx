// src/pages/admin/Dashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../redux/adminSlice";
import Loader from "./components/Loader";
import AdminLayout from "./components/AdminLayout";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Total Orders: {dashboard.totalOrders}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Total Revenue: ₹ {dashboard.totalRevenue}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Active Users: {dashboard.activeUsers}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Total Sellers: {dashboard.totalSellers}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
