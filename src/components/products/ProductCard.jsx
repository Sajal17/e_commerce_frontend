import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { addToRecentlyViewed } from "../../utils";

const ProductCard = React.memo(({ product, cartItem, onAddToCart }) => {
  if (!product) return null;
  const normalizedProduct = {
    ...product,
    id: product.id || product._id || product.productId
  };

  if (!normalizedProduct.id) {
    console.warn(" Missing product.id:", product);
    return null;
  }

  const [imgSrc, setImgSrc] = useState(
    normalizedProduct.imageUrl || "/default_product.png"
  );

  useEffect(() => {
    setImgSrc(normalizedProduct.imageUrl || "/default_product.png");
  }, [normalizedProduct]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition flex flex-col">
      <Link
        to={`/product/${normalizedProduct.id}`}
        onClick={() => addToRecentlyViewed(normalizedProduct)}
        className="relative w-full pt-[100%] overflow-hidden rounded-t-lg cursor-pointer"
      >
        <img
          src={imgSrc}
          alt={normalizedProduct.name}
          onError={() => setImgSrc("/default_product.png")}
          className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link
          to={`/product/${normalizedProduct.id}`}
          onClick={() => addToRecentlyViewed(normalizedProduct)}
        >
          <h3
            className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 truncate"
            title={normalizedProduct.name}
          >
            {normalizedProduct.name}
          </h3>
        </Link>

        {normalizedProduct.brand && (
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
            by {normalizedProduct.brand}
          </p>
        )}
        <div className="flex items-center mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
          ))}
        </div>
        <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          ₹ {normalizedProduct.price?.toLocaleString() || "N/A"}
        </div>
        <button
          onClick={(e) => {
          e.stopPropagation();
          onAddToCart(normalizedProduct);
          }}
          className={`w-full py-2 rounded-lg font-medium text-white transition-all duration-300 ${
            cartItem
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          }`}
        >
          {cartItem ? `In Cart (${cartItem.quantity})` : "Add to Cart"}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;