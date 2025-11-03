// src/components/ProductModal.jsx
import React from "react";

const ProductModal = ({ selected, setSelected, addToCart }) => {
  if (!selected) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full relative z-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Image */}
        <img src={selected.imageUrl || "/default_product.png"} alt={selected.name} className="w-full h-96 object-cover rounded-lg" />

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold">{selected.name}</h3>
            <div className="mt-2 text-lg font-bold">₹{selected.price}</div>
            <div className="mt-1 text-sm text-gray-500">{selected.rating} ★ • {selected.reviews || 0} reviews</div>
            <p className="mt-4 text-sm text-gray-700">
              {selected.description || "No description available."}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { addToCart(selected); setSelected(null); }}
              className="px-4 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-3 rounded-md border hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
