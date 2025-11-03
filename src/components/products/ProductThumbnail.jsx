// src/components/products/ProductThumbnail.jsx
import React from "react";

const ProductThumbnail = ({ images, selectedImage, onSelect }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img || "/default_product.png"}
          alt={`Thumbnail ${idx}`}
          onClick={() => onSelect(img)}
          className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
            selectedImage === img
              ? "border-blue-500 scale-105"
              : "border-transparent hover:border-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default ProductThumbnail;
