// src/pages/admin/Sellers.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSellers, blockSeller } from "../../store/adminSlice";

const Sellers = () => {
  const dispatch = useDispatch();
  const { sellers, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  const handleBlock = (id) => {
    if (window.confirm("Are you sure to block this seller?")) {
      dispatch(blockSeller(id));
    }
  };

  if (loading) return <p className="text-center mt-20">Loading sellers...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sellers</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.active ? "Active" : "Blocked"}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleBlock(s.id)}
                >
                  {s.active ? "Block" : "Unblock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sellers;
