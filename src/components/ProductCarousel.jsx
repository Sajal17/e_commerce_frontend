// src/components/ProductCarousel.jsx
import React from "react";
import ProductCardDetailed from "./ProductCardDetailed"; // Flipkart-style card

const ProductCarousel = ({ title, products = [], cartItems = [], onAddToCart }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="my-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto py-2 px-1 snap-x snap-mandatory scrollbar-hide">
        {products.map(product => {
          const cartItem = cartItems.find(item => item.id === product.id);
          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-72 md:w-80 lg:w-96 snap-start hover:scale-105 transition-transform"
            >
              <ProductCardDetailed
                product={product}
                cartItem={cartItem}
                onAddToCart={onAddToCart}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCarousel;
