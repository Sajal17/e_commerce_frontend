// src/hooks/useProductPreload.js
import { useRef } from "react";
import { fetchProductById } from "../api/products";

const cache = new Map();

export function useProductPreload() {
  const controllerRef = useRef(null);

  const preloadProduct = async (productId) => {
    if (cache.has(productId)) return cache.get(productId);

    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const data = await fetchProductById(productId, { signal: controllerRef.current.signal });
      cache.set(productId, data);
      return data;
    } catch (err) {
      if (err.name !== "AbortError") console.error("Preload failed:", err);
    }
  };

  const getCachedProduct = (productId) => cache.get(productId);

  return { preloadProduct, getCachedProduct };
}
