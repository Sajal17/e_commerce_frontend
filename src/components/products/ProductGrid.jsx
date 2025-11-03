// src/components/products/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onAddToCart, cartItems = [] }) => {
  if (!products?.length)
    return <p className="text-center text-gray-500 py-10">No products found.</p>;

  return (
   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
  {products.map((product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    return (
      <ProductCard
        key={product.id}
        product={product}
        cartItem={cartItem}
        onAddToCart={onAddToCart}
      />
    );
  })}
</div>

  );
};

export default ProductGrid;