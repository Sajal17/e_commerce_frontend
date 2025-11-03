import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSellerProducts } from "../../redux/slices/sellerProductSlice";
import { selectSeller } from "../../redux/slices/sellerSlice";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const seller = useSelector(selectSeller);

  useEffect(() => {
    if (seller?.id) dispatch(fetchSellerProducts(seller.id));
  }, [dispatch, seller]);

  // Absolute paths to avoid relative URL issues
  const tabs = [
    { label: "Profile", path: "/seller/dashboard/profile" },
    { label: "Products", path: "/seller/dashboard/products" },
    { label: "Add Product", path: "/seller/dashboard/addProduct" },
    { label: "Orders", path: "/seller/dashboard/orders" },
    { label: "Analytics", path: "/seller/dashboard/analytics" },
  ];

  return (
    <main className="pt-10 max-w-7xl mx-auto p-4 flex gap-4">
      {/* Sidebar */}
      <aside className="w-60 bg-white rounded-xl shadow p-4 flex flex-col gap-2 sticky top-20 h-fit">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              isActive
                ? "bg-blue-600 text-white px-3 py-2 rounded"
                : "text-gray-900 hover:bg-gray-100 px-3 py-2 rounded"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </aside>

      {/* Main Content */}
      <section className="flex-1">
        <Outlet /> {/* Nested routes render here */}
      </section>
    </main>
  );
};

export default SellerDashboard;