// src/utils.js
export const addToRecentlyViewed = (product) => {
  if (!product?.id) return;

  const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // Remove duplicates
  const filtered = stored.filter((p) => p.id !== product.id);

  // Add new product at start, keep max 10
  const updated = [product, ...filtered].slice(0, 10);

  localStorage.setItem("recentlyViewed", JSON.stringify(updated));
};
