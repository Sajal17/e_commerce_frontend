import React from "react";

const ProductFilter = ({ filters, onChange }) => {
  const { category, brand, priceRange, sortBy } = filters;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
      <select
        value={category}
        onChange={(e) => onChange("category", e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
        <option value="home">Home & Kitchen</option>
      </select>
      <input
        type="text"
        value={brand}
        onChange={(e) => onChange("brand", e.target.value)}
        placeholder="Search by Brand"
        className="border p-2 rounded-lg"
      />
      <div className="flex items-center gap-2">
        <span>₹</span>
        <input
          type="number"
          value={priceRange.min}
          onChange={(e) => onChange("priceRange", { ...priceRange, min: e.target.value })}
          placeholder="Min"
          className="border p-2 w-20 rounded-lg"
        />
        <span>-</span>
        <input
          type="number"
          value={priceRange.max}
          onChange={(e) => onChange("priceRange", { ...priceRange, max: e.target.value })}
          placeholder="Max"
          className="border p-2 w-20 rounded-lg"
        />
      </div>
      <select
        value={sortBy}
        onChange={(e) => onChange("sortBy", e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="">Sort By</option>
        <option value="price_low_high">Price: Low → High</option>
        <option value="price_high_low">Price: High → Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
};

export default ProductFilter;
