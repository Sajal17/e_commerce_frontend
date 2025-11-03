import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editProduct } from "../../redux/slices/sellerProductSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleProduct } from "../../api/seller";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getSingleProduct(id);
        const data = res.data;

        setProductData({
          id: data.id || data._id || data.productId,
          name: data.name || "",
          description: data.description || "",
          brand: data.brand || "",
          price: data.price || "",
          category: data.category || "",
          releaseDate: data.releaseDate || "",
          available: data.available || false,
          quantity: data.quantity || 0,
          imageFile: null,
        });

        setImagePreview(data.imageUrl || "/default_product.png");
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!productData)
    return <p className="text-center mt-20 text-lg font-medium">Loading...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    setProductData((prev) => ({ ...prev, available: e.target.checked }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData((prev) => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.id) {
    console.error("Product ID is missing! Cannot update.");
    alert("Product ID missing. Refresh and try again.");
    return;
    }
    const formData = new FormData();
    const payload = { ...productData };
    delete payload.imageFile;
    formData.append(
      "product",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (productData.imageFile) {
      formData.append("imageFile", productData.imageFile);
    }

    try {
      await dispatch(editProduct({ id: productData.id, data: formData })).unwrap();
      alert("Product updated successfully!");
      navigate("/seller/dashboard/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  return (
    <main className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:flex gap-8">
        {/* Image Section */}
        <div className="md:w-1/3 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Product Image</h3>
          <div className="w-full h-64 mb-4 border rounded-lg overflow-hidden">
            <img
              src={imagePreview}
              alt="Product Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm 
                       file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 
                       cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
          />
        </div>

        {/* Form Section */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Edit Product</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block font-semibold mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={productData.brand}
                onChange={handleChange}
                placeholder="Brand"
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
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

            {/* Price & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={productData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  min="0"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Available */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={productData.available}
                onChange={handleCheckbox}
                className="h-4 w-4"
              />
              <label className="font-medium">Available</label>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Release Date */}
            <div>
              <label className="block font-semibold mb-1">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={productData.releaseDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditProduct;