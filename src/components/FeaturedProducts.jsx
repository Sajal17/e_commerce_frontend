import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addItemToCart } from "../redux/slices/cartSlice";
import ProductCard from "./products/ProductCard";

const FeaturedProducts = ({ category = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleProductClick = (productId) => {
  navigate(`/product/${productId}`, { replace: true });
};


  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/public/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        let fetchedProducts = Array.isArray(res.data) ? res.data : [];

        if (category) {
          fetchedProducts = fetchedProducts.filter(
            (p) => p.category?.toLowerCase() === category.toLowerCase()
          );
        }

        // ✅ Normalize IDs for all products
        const normalizedProducts = fetchedProducts.map((p) => ({
          ...p,
          id: p.id || p._id || p.productId
        }));

        setProducts(normalizedProducts.slice(0, 8));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [baseUrl, category]);

  const handleAddToCart = (product) => {
    dispatch(addItemToCart({ ...product, quantity: 1 }));
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">Featured Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, index) => {
          const cartItem = cartItems.find(
            (item) => (item.id || item._id || item.productId) === product.id
          );

          return (
            <div
              key={product.id || index}
              onClick={() => handleProductClick(product.id)}
              className="cursor-pointer hover:scale-105 transition-transform"
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
    </div>
  );
};

export default FeaturedProducts;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { addItemToCart} from "../redux/slices/cartSlice";
// import ProductCard from "./products/ProductCard";

// const FeaturedProducts = ({ category = "" }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const cartItems = useSelector((state) => state.cart.items);
//   const user = useSelector((state) => state.auth.user);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const baseUrl = import.meta.env.VITE_API_URL;
//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`);
//   };
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     //console.log("JWT token from localStorage:", token);
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//        const res = await axios.get(`${baseUrl}/api/public/products`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // <-- send token here
//         },
//         withCredentials: true, // only if backend uses cookies
//       });
//         let filtered = Array.isArray(res.data) ? res.data : [];
//         if (category) {
//           filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
//         }

//          const normalizedProducts = filtered.map((p) => ({
//           ...p,
//           id: p.id || p._id,
//         }));
//         setProducts(normalizedProducts.slice(0, 8)); // show max 8 products
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [baseUrl, category]);

//   const handleAddToCart = (product) => {
//       console.log("Adding product:", product);
//       if (user) {
//         dispatch(addItemToCart({ ...product, quantity: 1 }));
//       } else {
//         dispatch(addLocalItem({ ...product, quantity: 1 }));
//       }
//     };

//   if (loading) return <p className="text-center py-10">Loading products...</p>;

//   return (
//     <div className="my-6">
//       <h2 className="text-xl font-bold mb-4">Featured Products</h2>

//       {/* ✅ Clickable Product Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {products.map((product, index) => {
//           const cartItem = cartItems.find(
//             (item) => item.id === product.id || item._id === product._id
//           );

//           return (
//             <div
//               key={product.id || product._id || index}
//               onClick={() => handleProductClick(product.id || product._id)}
//               className="cursor-pointer hover:scale-105 transition-transform"
//             >
//               <ProductCard
//                 product={product}
//                 cartItem={cartItem}
//                 onAddToCart={(e) => {
//                   e.stopPropagation(); // prevent navigation when clicking add to cart
//                   handleAddToCart(product);
//                 }}
//               />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default FeaturedProducts;


/*import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${baseUrl}/products/featured`);
        setProducts(Array.isArray(res.data) ? res.data.slice(0, 8) : []);
      } catch (err) {
        console.error("Error fetching featured products", err);
      }
    };
    fetchFeatured();
  }, [baseUrl]);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;*/