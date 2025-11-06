import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSellerProducts,
  removeProduct,
} from "../../redux/slices/sellerProductSlice";
import { useNavigate } from "react-router-dom";

const SellerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector(
    (state) => state.sellerProducts
  );
  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const handleEdit = (productId) => {
    navigate(`/seller/dashboard/product/edit/${productId}`);
  };

  const handleDelete = (id) => {
    if (!id || id === "undefined") {
      alert("Invalid product ID — cannot delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Deleting product ID:", id);
      dispatch(removeProduct(id));
      dispatch(fetchSellerProducts());
    }
  };

  if (loading)
    return <h2 className="text-center mt-20">Loading products...</h2>;
  if (error)
    return <h2 className="text-center mt-20 text-red-500">{error}</h2>;
  if (!products || products.length === 0)
    return (
      <h2 className="text-center mt-20 text-gray-500">No products found.</h2>
    );

  return (
    <main className="px-2 sm:px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        My Products
      </h1>
      
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => {
          const productId =
            product.id || product.productId || product._id || index;

          return (
            <div
              key={productId}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                  <img
                    src={product.imageUrl || "/default_product.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  {product.name}
                </h3>
                <p className="text-sm italic text-gray-500 dark:text-gray-400 truncate">
                  {product.brand}
                </p>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
                  ₹ {product.price?.toLocaleString() || "N/A"}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(productId)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(productId)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default SellerProducts;
