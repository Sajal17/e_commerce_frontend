import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSellerProfile, updateSeller,deleteSeller } from "../../redux/slices/sellerSlice";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { data: seller, loading, error } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // User info
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    
    // Seller info
    companyName: "",
    businessAddress: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
  });

  useEffect(() => {
    dispatch(fetchSellerProfile());
  }, [dispatch]);

  useEffect(() => {
      console.log("Seller data:", seller);
    if (seller) {
      setFormData({
        firstName: seller.firstName || "",
        lastName: seller.lastName || "",
        email: seller.email || "",
        phoneNumber: seller.phoneNumber || "",
        
        companyName: seller.companyName || "",
        businessAddress: seller.businessAddress || "",
        bankAccountNumber: seller.bankAccountNumber || "",
        ifscCode: seller.ifscCode || "",
        bankName: seller.bankName || "",
        branchName: seller.branchName || "",
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSeller(formData));
  };
 const handleDelete = () => {
  if (window.confirm("Are you sure?")) {
    dispatch(deleteSeller())
      .unwrap() // ensures proper promise handling in Redux Toolkit
      .then(() => {
        dispatch(logout());  // clears auth state
        navigate("/login");  // redirect after deletion
      })
      .catch((err) => console.error(err));
  }
};


  if (loading)
    return <p className="text-gray-500 text-center">Loading profile...</p>;
  if (error)
    return <p className="text-red-500 text-center">{error}</p>;

  return (
   <main className="min-h-[70vh] bg-gray-50 dark:bg-gray-900 ">
   <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Seller Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50"
        />

        {/* Seller Info */}
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50"
        />
        <textarea
          name="businessAddress"
          placeholder="Business Address"
          value={formData.businessAddress}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50"
          rows="2"
        ></textarea>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="bankAccountNumber"
            placeholder="Bank Account Number"
            value={formData.bankAccountNumber}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50"
          />
          <input
            type="text"
            name="ifscCode"
            placeholder="IFSC Code"
            value={formData.ifscCode}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="bankName"
            placeholder="Bank Name"
            value={formData.bankName}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50"
          />
          <input
            type="text"
            name="branchName"
            placeholder="Branch Name"
            value={formData.branchName}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50"
          />
        </div>

        <div className="flex gap-4 mt-4">
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
  >
    Update Profile
  </button>

 <button
  type="button"  // Important: prevents form submission
  onClick={handleDelete}
  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
>
  Delete Profile
</button>
   </div>
      </form>
    </div>
    </main>
  );
};

export default SellerProfile;
