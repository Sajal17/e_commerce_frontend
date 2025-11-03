// src/pages/admin/components/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Products", path: "/admin/products" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Sellers", path: "/admin/sellers" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
