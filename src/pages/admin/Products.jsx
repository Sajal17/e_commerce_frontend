// src/pages/admin/Products.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "../../store/adminSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p className="text-center mt-20">Loading products...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td className="border p-2">{prod.id}</td>
              <td className="border p-2">{prod.name}</td>
              <td className="border p-2">{prod.brand}</td>
              <td className="border p-2">₹ {prod.price.toLocaleString()}</td>
              <td className="border p-2">{prod.stock}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(prod.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
