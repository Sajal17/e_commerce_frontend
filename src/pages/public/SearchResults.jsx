import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../../components/products/ProductCard";
import ProductCardH from "../../components/products/ProductCardH";
import { fetchSimilarProducts } from "../../redux/slices/similarProductSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../../redux/slices/searchSlice";

const SearchResults = () => {
  const dispatch = useDispatch();
  const { results = [], loading, error } = useSelector((state) => state.search);
  const location = useLocation();
  const navigate = useNavigate();

  // Get query and selected product from URL
  const query = new URLSearchParams(location.search).get("q") || "";
  const selectedParam = new URLSearchParams(location.search).get("selected");
  const selectedProductId = selectedParam ? Number(selectedParam) : null;

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { items: sameCategoryResults, loading: similarLoading } = useSelector(
  (state) => state.similar
  );

// Determine category from selected product
const category = selectedProduct?.category;
  // Fetch new results whenever query changes
  useEffect(() => {
    if (query) dispatch(fetchSearchResults(query));
  }, [dispatch, query]);

  // Find selected product from results
  useEffect(() => {
    if (results.length && selectedProductId) {
      const product = results.find((p) => Number(p.productId) === selectedProductId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [results, selectedProductId]);

  // Reset filters on query or selection change
  useEffect(() => {
    setSelectedBrands([]);
    setPriceRange([0, 1000000]);
  }, [query, selectedProductId]);

  // Determine category context for recommendations
 useEffect(() => {
  if (category) dispatch(fetchSimilarProducts(category));
}, [category, dispatch]);
useEffect(() => {
  console.log(" Results:", results);
  console.log(" Selected Product:", selectedProduct);
  console.log(" Same Category Results:", sameCategoryResults);
}, [results, selectedProduct, sameCategoryResults]);

  // Filter by name based on query
  const filteredByName = useMemo(() => {
    if (!query) return sameCategoryResults;
    const lowerQuery = query.toLowerCase();
    return sameCategoryResults.filter((p) =>
      p.name?.toLowerCase().includes(lowerQuery)
    );
  }, [sameCategoryResults, query]);

  // Get unique brands for filter
  const brands = useMemo(() => {
    return [...new Set(sameCategoryResults.map((p) => p.brand))].filter(Boolean);
  }, [sameCategoryResults]);

  const toggleBrand = (brand) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  // Apply brand and price filters
  const filteredResults = useMemo(() => {
    return filteredByName
      .filter((p) => (selectedBrands.length ? selectedBrands.includes(p.brand) : true))
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
      .filter((p) => Number(p.productId) !== selectedProductId);
  }, [filteredByName, selectedBrands, priceRange]);

  // Min & max price for slider
  const minPrice = useMemo(
    () => (sameCategoryResults.length ? Math.min(...sameCategoryResults.map((p) => p.price)) : 0),
    [sameCategoryResults]
  );
  const maxPrice = useMemo(
    () => (sameCategoryResults.length ? Math.max(...sameCategoryResults.map((p) => p.price)) : 1000000),
    [sameCategoryResults]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 border border-gray-200 rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        {/* Brand Filter */}
        {brands.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Brand</h4>
            {brands.map((brand) => (
              <div key={brand} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  id={`brand-${brand}`}
                  className="mr-2"
                />
                <label htmlFor={`brand-${brand}`} className="text-sm">{brand}</label>
              </div>
            ))}
          </div>
        )}

        {/* Price Filter */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Price</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={priceRange[0]}
              min={minPrice}
              max={priceRange[1]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-1/2 border border-gray-300 rounded px-2 py-1"
              placeholder="Min"
            />
            <input
              type="number"
              value={priceRange[1]}
              min={priceRange[0]}
              max={maxPrice}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-1/2 border border-gray-300 rounded px-2 py-1"
              placeholder="Max"
            />
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full"
          />
        </div>

        <button
          onClick={() => {
            setSelectedBrands([]);
            setPriceRange([0, 1000000]);
          }}
          className="text-sm text-indigo-600 hover:underline"
        >
          Clear Filters
        </button>
      </aside>

      {/* Products */}
      <main className="flex-1">
  {loading && <p>Loading...</p>}
  {error && <p className="text-red-500">{error}</p>}

  {/* Selected product */}
  {selectedProduct && (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Selected Product</h3>
      <ProductCardH product={selectedProduct} highlighted />
    </div>
  )}

{/* Filtered results */}
{filteredResults?.length ? (
  <div className="space-y-3">
    {filteredResults.map((product) => (
      <div
  key={product.productId}
  onClick={() => navigate(`/product/${product.productId}`)}
  className="cursor-pointer hover:shadow-lg transition"
>
  <ProductCardH
    product={product}
    highlighted={product.productId === selectedProductId}
  />
</div>
    ))}
  </div>
) : (
  !loading && <p>No products found.</p>
)}



  {/* Similar products */}
  {sameCategoryResults.length > 0 && (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Similar Products</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {sameCategoryResults.slice(0, 10).map((product) => (
          <div
            key={product.productId}
            className="transform scale-90 hover:scale-95 transition-transform duration-200"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )}
</main>

    </div>
  );
};

export default SearchResults;
