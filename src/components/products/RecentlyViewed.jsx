import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { addItemToCart } from "../../redux/slices/cartSlice";

const RecentlyViewed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.items) || [];
  const recentProducts = useSelector((state) => state.recentlyViewed?.items) || [];
  const scrollRef = useRef();

  const handleAddToCart = (product) => {
    if (!product || !product.id) return;
    dispatch(addItemToCart({ ...product, quantity: 1 }));
  };

  const handleNavigate = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Recently Viewed
      </h2>

      {!recentProducts.length ? (
        <p className="text-gray-500">No products viewed yet.</p>
      ) : (
        <div
          ref={scrollRef}
          className="recent-wrapper flex gap-3 overflow-x-auto py-1 px-1 scrollbar-hide"
        >
          {recentProducts
            .filter((product) => product && product.id)
            .map((product, index) => {
              const cartItem = cartItems.find((item) => item.id === product.id) || null;

              return (
                <div
     key={`${product.id}-${index}`}
     className="flex-shrink-0 snap-start w-[60%] sm:w-[45%] md:w-[30%] lg:w-[22%] xl:w-[18%]"
     >
    <ProductCard
    product={product}
    cartItem={cartItem}
    onAddToCart={() => handleAddToCart(product)}
     />
    </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;