// src/pages/admin/components/AdminLayout.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-gray-100 p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
