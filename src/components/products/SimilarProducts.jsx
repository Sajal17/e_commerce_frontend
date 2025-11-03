import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "./ProductCard";
import { fetchSimilarProducts } from "../../redux/slices/similarProductSlice";
import { addItemToCart } from "../../redux/slices/cartSlice";

const SimilarProducts = ({ category, excludeId }) => {
  const dispatch = useDispatch();
  const { items: similarProducts, loading, error } = useSelector((state) => state.similar);
  const cartItems = useSelector((state) => state.cart.items) || [];

  useEffect(() => {
    if (!category) return;
    dispatch(fetchSimilarProducts(category));
  }, [category, dispatch]);

  const handleAddToCart = (product) => {
    const normalizedProduct = { ...product, id: product.id || product._id || product.productId };
    dispatch(addItemToCart({ ...normalizedProduct, quantity: 1 }));
  };

  // Filter out the currently viewed product
  const filteredProducts = similarProducts.filter(
    (p) => p.id !== (excludeId?.id || excludeId?._id || excludeId?.productId || excludeId)
  );

  if (loading) return <p className="text-center py-4">Loading similar products...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;
  if (!filteredProducts.length) return null;

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
      <div className="recent-wrapper flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide">
        {filteredProducts.slice(0, 10).map((product, index) => {
          const cartItem = cartItems.find(
            (item) => (item.id || item._id || item.productId) === product.id
          );
          return (
            <div key={`${product.id}-${index}`} className="flex-shrink-0" style={{ width: "260px" }}>
              <ProductCard
                product={product}
                cartItem={cartItem}
                onAddToCart={handleAddToCart}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarProducts;
