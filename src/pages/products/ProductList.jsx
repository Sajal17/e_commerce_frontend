import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../store/productSlice";
import { addToCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading, error } = useSelector((state) => state.products);
  const { searchTerm, selectedCategory } = useSelector((state) => state.search);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products based on search & category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory
        ? p.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchesSearch = searchTerm.trim()
        ? [p.name, p.brand, p.category, p.description].some((field) =>
            field?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  if (loading) return <h2 className="text-center mt-20">Loading products...</h2>;
  if (error) return <h2 className="text-center mt-20 text-red-500">{error}</h2>;
  if (filteredProducts.length === 0)
    return <h2 className="text-center mt-20 text-gray-500">No products found.</h2>;

  return (
    <main className="pt-20 px-2 sm:px-4">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col justify-between"
          >
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                <img
                  src={
                    product.imageData
                      ? `data:${product.imageType};base64,${product.imageData}`
                      : product.imageName
                      ? `${import.meta.env.VITE_API_URL}/images/${product.imageName}`
                      : "/default_product.png"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {product.name.toUpperCase()}
              </h3>
              <p className="text-sm italic text-gray-500 dark:text-gray-400 truncate">
                by {product.brand}
              </p>
              <hr className="my-2 border-gray-300 dark:border-gray-600" />
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                ₹ {product.price?.toLocaleString() || "N/A"}
              </p>
            </div>
            <button
              onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
              className="mt-3 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2 rounded-lg transition"
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ProductList;