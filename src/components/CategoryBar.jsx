import React from "react";
import { useNavigate } from "react-router-dom";

function CategoryBar({ categories = [], selectedCategory }) {
   const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg px-4 py-3 mt-1">
      <div className="category-wrapper">
        {categories.map((cat, index) => (
          <button
          key={index}
          type="button"
          onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
          className={`inline-flex flex-col items-center justify-center min-w-[120px] px-3 py-2 rounded-lg transition-transform duration-150
             transform cursor-pointer bg-white text-gray-700 
            hover:bg-gray-100 hover:text-gray-900${
            selectedCategory?.toLowerCase() === cat.name.toLowerCase()
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="text-xl">{cat.icon}</span>
          <span className="text-sm mt-1">{cat.name}</span>
        </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;