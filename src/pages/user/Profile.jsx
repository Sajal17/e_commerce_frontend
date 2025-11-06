
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, updateProfile } from "../../redux/slices/userSlice";
import Address from "./Address";
import Orders from "./Orders";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      const username = currentUser.username || "";
      const email = currentUser.email || (username.includes("@") ? username : "");
      const phone = currentUser.phoneNumber || (!username.includes("@") ? username : "");

      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email,
        phone,
        address: currentUser.addresses?.map(a => `${a.street}, ${a.city}`)?.join(", ") || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  if (loading)
    return <h2 className="text-center mt-20 text-gray-700">Loading profile...</h2>;
  if (error)
    return <h2 className="text-center mt-20 text-red-500 font-semibold">{error}</h2>;

  return (
    <main className="pt-20 max-w-7xl mx-auto p-4 flex gap-6">
      <aside className="w-60 bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2">
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "address" ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("address")}
        >
          Address
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "wishlist" ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("wishlist")}
        >
          Wishlist
        </button>
      </aside>
      <section className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        {activeTab === "profile" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer"
              >
                Update Profile
              </button>
            </form>
          </>
        )}

        {activeTab === "address" && <Address />}
        {activeTab === "orders" && (
        <div className="pt-2">
          <Orders />
         </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Wishlist</h2>
            <p className="text-gray-500 dark:text-gray-400">Wishlist coming soon...</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;