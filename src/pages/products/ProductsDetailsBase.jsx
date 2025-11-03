import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../redux/slices/cartSlice";
import { fetchProductById } from "../../api/products";
import SimilarProducts from "../../components/products/SimilarProducts";
import RecentlyViewed from "../../components/products/Recentlyviewed";

const ProductDetailsBase = ({ onProductLoad, children, showRecentlyViewed = false }) => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const productData = await fetchProductById(id);
        if (!isMounted) return;

        const normalizedProduct = {
          ...productData,
          id: productData.id || productData._id || productData.productId,
        };

        setProduct(normalizedProduct);
        const firstImg =
          normalizedProduct.images?.[0] ||
          normalizedProduct.imageName ||
          normalizedProduct.imageUrl ||
          "/default_product.png";
        setSelectedImage(firstImg);

        if (showRecentlyViewed) {
          const stored = JSON.parse(localStorage.getItem("recentlyViewedProducts") || "[]");
          const filtered = stored.filter((p) => p.id !== normalizedProduct.id);
          const updated = [normalizedProduct, ...filtered].slice(0, 10);
          localStorage.setItem("recentlyViewedProducts", JSON.stringify(updated));
          setRecentlyViewed(updated);
        }

        if (onProductLoad) onProductLoad(normalizedProduct);
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching product:", err);
          setError("Failed to load product");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const getImageUrl = (img) => {
    if (!img) return "/default_product.png";
    if (img.startsWith("http")) return img;
    return `${baseUrl}/product/${product?.id}/image`;
  };

  if (loading) return <h2 className="text-center mt-32 text-gray-700">Loading...</h2>;
  if (error) return <h2 className="text-center mt-32 text-red-500 font-semibold">{error}</h2>;
  if (!product) return <h2 className="text-center mt-32 text-gray-500">Product not found</h2>;

  return (
    <main className="pt-4 px-4 lg:pt-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* ✅ LEFT SIDE - Images Section */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:sticky lg:top-24">
          
          {/* ✅ Image Section: Thumbnails on left (desktop), below on mobile */}
          <div className="flex flex-col sm:flex-col lg:flex-row gap-4 items-start">
            {/* Thumbnails */}
            <div
  className="order-2 lg:order-1 flex flex-row lg:flex-col gap-2 
             overflow-x-auto lg:overflow-y-auto justify-center lg:justify-start 
             w-full lg:w-auto no-scrollbar"
>
  {(product.images?.length ? product.images : [product.imageName || product.imageUrl]).map(
    (img, idx) => (
      <button
        key={idx}
        onClick={() => setSelectedImage(img)}
        className={`border rounded-lg overflow-hidden hover:scale-105 transition-transform ${
          selectedImage === img ? "border-blue-600" : "border-gray-300"
        }`}
      >
        <img
          src={getImageUrl(img)}
          alt={`${product.name} ${idx + 1}`}
          className="w-16 h-16 object-contain"
        />
      </button>
    )
  )}
</div>


            {/* Main Product Image */}
            <div className="order-1 lg:order-2 flex-1 w-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow">
              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-contain"
              />
            </div>
          </div>

          {/* Buttons below image */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => dispatch(addItemToCart({ ...product, quantity: 1 }))}
              className="flex-1 py-3 rounded-lg font-semibold text-white 
                bg-gradient-to-r from-blue-500 to-indigo-500 
                hover:from-blue-600 hover:to-indigo-600 
                transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) navigate("/login");
                else {
                  dispatch(addItemToCart({ ...product, quantity: 1 }));
                  navigate("/checkout");
                }
              }}
              className="flex-1 py-3 rounded-lg font-semibold text-white 
                bg-orange-500 hover:bg-orange-600 
                transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* ✅ RIGHT SIDE - Product Details */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6 mt-6 lg:mt-0">
          {children(product)}
        </div>
      </div>

      {/* ✅ SIMILAR & RECENT */}
      {product.category && (
        <div className="mt-12 max-w-7xl">
          <SimilarProducts category={product.category} excludeId={product.id} />
        </div>
      )}

      {showRecentlyViewed && recentlyViewed.length > 0 && (
        <div className="mt-12 max-w-7xl">
          <RecentlyViewed products={recentlyViewed} />
        </div>
      )}
    </main>
  );
};

export default ProductDetailsBase;