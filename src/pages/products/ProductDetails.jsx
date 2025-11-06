import React from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import ProductDetailsBase from "../products/ProductsDetailsBase";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addItemToCart({ ...product, quantity: 1 }));
  };

  const handleBuyNow = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(addItemToCart({ ...product, quantity: 1 }));
    navigate("/checkout");
  };

  return (
    <ProductDetailsBase showRecentlyViewed>
      {(product) => (
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
              {product.rating || "4.3"} ★
            </span>
            <span>({product.reviews || "12,345"} ratings)</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-800">₹{product.price}</span>
            {product.mrp && (
              <>
                <span className="line-through text-gray-400">₹{product.mrp}</span>
                <span className="text-green-600 font-semibold">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                </span>
              </>
            )}
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold mb-2 text-gray-800">Available offers</h4>
            <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
              <li>Bank Offer: 10% instant discount on HDFC Bank Cards</li>
              <li>Special Price: Get extra ₹2000 off (price inclusive of discount)</li>
              <li>No Cost EMI on select cards</li>
            </ul>
          </div>
          <div className="border-t pt-4 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Delivery:</span> Usually delivered in 3-5 days.
            </p>
            <p>
              <span className="font-semibold">Return Policy:</span> 7-day replacement only.
            </p>
          </div>
        </div>
      )}
    </ProductDetailsBase>
  );
};

export default ProductDetails;