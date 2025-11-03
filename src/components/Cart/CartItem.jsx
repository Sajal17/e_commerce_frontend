import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeLocalItem,
} from "../../redux/slices/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_API_URL;

  // Normalize ID
  const normalizedId = String(item.id || item._id || item.productId);

  // Get image source
  const getImageUrl = () => {
    const product = item.product || item;
    if (product.imageData && product.imageType) {
      return `data:${product.imageType};base64,${product.imageData}`;
    }
    if (product.imageName) {
      return `${baseUrl}/images/${product.imageName}`;
    }
    if (product.imageUrl && /^https?:\/\//.test(product.imageUrl)) {
      return product.imageUrl;
    }
    return "/default_product.png";
  };

  const [imgSrc, setImgSrc] = useState(getImageUrl());

  useEffect(() => {
    setImgSrc(getImageUrl());
  }, [item]);

  const handleIncrease = () => {
    if (item.quantity < item.stockQuantity) {
      dispatch(increaseQuantity(normalizedId));
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(normalizedId));
    }
  };

  const handleRemove = () => {
    dispatch(removeLocalItem(normalizedId));
  };

  // Random delivery between 2–3 days (simulate Flipkart)
  const deliveryDays = Math.floor(Math.random() * 2) + 2;

  return (
    <li className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 mb-4 hover:shadow-lg transition w-full">
      {/* LEFT: Product Image */}
      <div className="w-full sm:w-40 md:w-48 flex-shrink-0 flex justify-center items-center">
        <img
          src={imgSrc}
          alt={item.name || "Product image"}
          onError={() => setImgSrc("/default_product.png")}
          className="w-36 h-36 object-contain rounded-lg"
        />
      </div>

      {/* RIGHT: Product Details */}
      <div className="flex-1 sm:ml-6 flex flex-col justify-between mt-4 sm:mt-0">
        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                {item.name}
              </h5>
              {item.brand && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 mt-1">
                  by {item.brand}
                </p>
              )}
              {/* Price below product name */}
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg block mt-3">
                ₹ {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>

            {/* ✅ Delivery info on right side */}
            <div className="text-right">
              <p className="text-green-600 text-sm font-medium mt-3">
               Delivery in {deliveryDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Quantity Controls + Remove */}
        <div className="mt-3">
          {/* <div className="flex items-center gap-3">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="px-2.5 py-1.5 bg-gray-200 rounded-md text-gray-700 font-bold disabled:opacity-50 hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="px-2 text-gray-800 dark:text-gray-100 font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.stockQuantity}
              className="px-2.5 py-1.5 bg-gray-200 rounded-md text-gray-700 font-bold disabled:opacity-50 hover:bg-gray-300 transition"
            >
              +
            </button>
          </div> */}

          {/* Remove Button below quantity */}
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 text-sm font-medium cursor-pointer mt-2"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;