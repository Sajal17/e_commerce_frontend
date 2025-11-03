import React from "react";
import { useNavigate } from "react-router-dom";

const AddressForm = ({ address, setAddress, onNext }) => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const isValid =
    address.fullName && address.street && address.city && address.state && address.phone;

  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} className="border p-2 rounded" />
        <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} className="border p-2 rounded" />
        <input name="street" placeholder="Street Address" value={address.street} onChange={handleChange} className="border p-2 rounded sm:col-span-2" />
        <input name="city" placeholder="City" value={address.city} onChange={handleChange} className="border p-2 rounded" />
        <input name="state" placeholder="State" value={address.state} onChange={handleChange} className="border p-2 rounded" />
        <input name="zip" placeholder="Zip Code" value={address.zip} onChange={handleChange} className="border p-2 rounded" />
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => navigate("/user/address")} className="text-blue-600 text-sm hover:underline">
           Manage Saved Addresses
        </button>
        <button
          disabled={!isValid}
          onClick={onNext}
          className={`px-4 py-2 rounded text-white ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AddressForm;