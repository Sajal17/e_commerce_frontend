import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ProductCard from "../../components/products/ProductCard";
import { addToCart } from "../../store/cartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return setError("User not logged in.");
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/wishlist/${user.id}`, {
          withCredentials: true,
        });
        setWishlist(res.data);
      } catch (err) {
        setError("Failed to fetch wishlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  if (loading) return <h2 className="text-center mt-20">Loading wishlist...</h2>;
  if (error) return <h2 className="text-center mt-20 text-red-500">{error}</h2>;
  if (!wishlist.length)
    return <h2 className="text-center mt-20 text-gray-500">Your wishlist is empty.</h2>;

  return (
    <main className="pt-20 max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </main>
  );
};

export default Wishlist;
