// src/pages/category/CategoryProducts.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { fetchProductsByCategory } from "../../api/category";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(["", "100000"]); // store as strings.. min-max
  const [sortBy, setSortBy] = useState(""); // e.g., price-asc, price-desc

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProductsByCategory(categoryName);
        // Normalize IDs
        const normalized = data.map((p) => ({
          ...p,
          id: p.id || p._id || p.productId,
        }));
        setProducts(normalized);
      } catch (err) {
        console.error("Failed to fetch category products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryName]);

  // Extract unique brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  }, [products]);

  // Apply filters & sorting
  useEffect(() => {
    let filtered = products;

    // Brand filter
    if (selectedBrands.length) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price filter
    filtered = filtered.filter(
  (p) =>
    p.price >= Number(priceRange[0] || 0) &&
    p.price <= Number(priceRange[1] || Infinity)
);

    // Sorting
    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);

    setFilteredProducts(filtered);
  }, [products, selectedBrands, priceRange, sortBy]);

  // Handle brand selection
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-6 py-6 px-4">
      {/* Sidebar Filters */}
      <aside className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow space-y-6">
        <h2 className="font-bold text-lg mb-2">Filters</h2>

        {/* Brands */}
        <div>
          <h3 className="font-semibold mb-2">Brands</h3>
          {allBrands.length ? (
            allBrands.map((brand) => (
              <div key={brand} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 mr-2"
                />
                <span>{brand}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No brands found</p>
          )}
        </div>

        {/* Price Filter */}
        <div>
          <h3 className="font-semibold mb-2">Price</h3>
          <div className="flex items-center gap-2">
            <input
             type="number"
             placeholder="Min"
             value={priceRange[0]}
             onChange={(e) =>
             setPriceRange([e.target.value, priceRange[1]]) // keep as string
            }
          className="w-1/2 border rounded px-2 py-1"
          />

      <input
       type="number"
        placeholder="Max"
      value={priceRange[1]}
       onChange={(e) =>
       setPriceRange([priceRange[0], e.target.value]) // keep as string
        }
          className="w-1/2 border rounded px-2 py-1"
          />
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </aside>

      {/* Products Grid */}
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="col-span-full text-center">Loading...</p>
        ) : filteredProducts.length ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={null} // You can integrate cart state here
              onAddToCart={() => console.log("Add to cart", product)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </main>
    </div>
  );
};

export default CategoryProducts;