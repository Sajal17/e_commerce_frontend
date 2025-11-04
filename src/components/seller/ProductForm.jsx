// ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  editProduct,
  clearSellerProductState,
  selectSellerProducts,
} from "../../redux/slices/sellerProductSlice";
import { getSingleProduct } from "../../api/seller";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 0.5 * 1024 * 1024;

const ProductForm = ({ productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sellerProducts = useSelector(selectSellerProducts);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    releaseDate: "",
    available: false,
    imageFile: null,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const res = await getSingleProduct(productId);
        setProduct({
          ...res.data,
          imageFile: null,
          imageUrl: res.data.imageUrl || "",
        });
      } catch (err) {
        alert("Failed to load product data.");
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Only JPEG, PNG, and WEBP images are allowed.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be less than 2MB.");
        return;
      }

      setProduct((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () =>
        setProduct((prev) => ({ ...prev, imageUrl: reader.result }));
      reader.readAsDataURL(file);
    } else if (type === "checkbox") {
      setProduct((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("brand", product.brand);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("description", product.description);
    formData.append("releaseDate", product.releaseDate);
    formData.append("available", product.available);
    if (product.imageFile) formData.append("imageFile", product.imageFile);

    try {
      if (productId) {
        await dispatch(editProduct({ id: productId, data: formData })).unwrap();
        alert("Product updated successfully!");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        alert("Product added successfully!");
      }
      dispatch(clearSellerProductState());
      navigate("/seller/dashboard/products");
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-gray-50 dark:bg-gray-900 ">
   <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {productId ? "Edit Product" : "Add New Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Mobile">Mobile</option>
            <option value="TV">TV</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home/Kitchen">Home/Kitchen</option>
            <option value="Beauty">Beauty</option>
            <option value="Sports">Sports</option>
            <option value="Toys">Toys</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            min="0"
            required
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            min="0"
            required
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={product.releaseDate}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="3"
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold mb-1">Product Image</label>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt="Product preview"
              className="w-full h-40 object-cover rounded-md mb-2 border"
            />
          )}
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border rounded-lg p-2 dark:border-gray-700"
          />
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            name="available"
            checked={product.available}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
          <label className="font-medium">Product Available</label>
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-[1.02] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : productId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
    </main>
  );
};

export default ProductForm;