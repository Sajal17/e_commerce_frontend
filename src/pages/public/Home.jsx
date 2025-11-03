import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CategoryBar from "../../components/CategoryBar";
import SlidingBanner from "../../components/SlidingBanner";
import FeaturedProducts from "../../components/FeaturedProducts";
import RecentlyViewed from "../../components/products/RecentlyViewed";
import { loadRecentlyViewed, addLocalRecentlyViewed } from "../../redux/slices/recentlyViewedSlice";

const categories = [
  { name: "Mobile", icon: "📱" },
  { name: "TV", icon: "📺" },
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👗" },
  { name: "Home-Kitchen", icon: "🏠" },
  { name: "Beauty", icon: "💄" },
  { name: "Sports", icon: "🏀" },
  { name: "Toys", icon: "🧸" },
  { name: "Books", icon: "📚" },
];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user?.id) {
      dispatch(loadRecentlyViewed(user.id));
    } else {
      // ✅ correct key name
      const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      stored.forEach(product => dispatch(addLocalRecentlyViewed(product)));
    }
  }, [dispatch]);

  return (
    <main className="max-w-10xl mx-auto px-4 pt-2">
      <CategoryBar
        selectedCategory={selectedCategory}
        categories={categories}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />
      <SlidingBanner />
      <FeaturedProducts
        category={selectedCategory}
        onProductClick={(productId) => navigate(`/product/${productId}`, { replace: true })}
      />
      <RecentlyViewed />
    </main>
  );
}

export default Home;
