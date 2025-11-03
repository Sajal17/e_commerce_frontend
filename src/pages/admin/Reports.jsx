// src/pages/admin/Reports.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReports } from "../../store/adminSlice";

const Reports = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-20">Loading reports...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <ul className="space-y-2">
        {reports.map((r) => (
          <li key={r.id} className="bg-white shadow rounded p-3 flex justify-between">
            <span>{r.title}</span>
            <span>{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
