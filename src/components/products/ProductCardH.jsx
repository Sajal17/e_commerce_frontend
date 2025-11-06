import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { addToRecentlyViewed } from "../../utils";

const ProductCardH = ({ product, cartItem, onAddToCart }) => {
  if (!product) return null;

  const normalizedProduct = {
    ...product,
    id: product.id || product._id || product.productId,
  };

  const [imgSrc, setImgSrc] = useState(
    normalizedProduct.imageUrl || "/default_product.png"
  );

  if (!normalizedProduct.id) return null;

  return (
    <div className="flex gap-4 p-5 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer">
      
      {/* Left Image */}
      <Link
  to={`/product/${normalizedProduct.id}`}
  onClick={() => addToRecentlyViewed(normalizedProduct)}
  className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 
             bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
>
  <img
    src={imgSrc}
    alt={normalizedProduct.name}
    onError={() => setImgSrc("/default_product.png")}
    className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 hover:scale-105"
  />
</Link>

      {/* Middle Section */}
      <div className="flex flex-col justify-between flex-1 pl-4 pr-2 translate-x-10">
        <Link
          to={`/product/${normalizedProduct.id}`}
          onClick={() => addToRecentlyViewed(normalizedProduct)}
        >
          <h3
            className="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg line-clamp-2"
            title={normalizedProduct.name}
          >
            {normalizedProduct.name}
          </h3>
        </Link>

        {normalizedProduct.brand && (
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Brand: <span className="font-medium">{normalizedProduct.brand}</span>
          </p>
        )}

        {/*  Add extra product properties */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Category: <span className="font-medium">{normalizedProduct.category || "N/A"}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stock: <span className="font-medium">{normalizedProduct.quantity || "N/A"}</span>
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-600 dark:text-gray-300">(reviews)</span>
        </div>
      </div>

      {/* Right Price & Cart */}
      <div className="flex flex-col justify-between items-end min-w-[100px] -translate-x-5">
        <p className="text-lg md:text-xl font-bold text-green-600">
          ₹ {normalizedProduct.price?.toLocaleString() || "0"}
        </p>
      </div>
    </div>
  );
};

export default React.memo(ProductCardH);