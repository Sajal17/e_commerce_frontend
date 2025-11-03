import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAddresses,
  createAddress,
  modifyAddress,
  removeAddress,
} from "../../redux/slices/addressSlice";

const Address = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  // For editing existing address
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    dispatch(loadAddresses());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const { fullName, phone, street, city, state, country, zip } = newAddress;
    if (!fullName || !phone || !street || !city || !state || !country || !zip) {
      alert("Please fill in all fields before saving the address.");
      return;
    }
    dispatch(createAddress(newAddress));
    setNewAddress({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    });
  };

  // Handle edit field change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited address
  const handleEditSave = (id) => {
    dispatch(modifyAddress({ id, data: editData }));
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Addresses</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Existing Addresses */}
      <div className="grid md:grid-cols-2 gap-4">
        {addresses?.length > 0 ? (
          addresses.map((a) => (
            <div key={a.id} className="p-4 border rounded-lg shadow-sm">
              {editingId === a.id ? (
                <>
                  {/* Edit form */}
                  {[
                    { name: "fullName", placeholder: "Full Name" },
                    { name: "phone", placeholder: "Phone" },
                    { name: "street", placeholder: "Street" },
                    { name: "city", placeholder: "City" },
                    { name: "state", placeholder: "State" },
                    { name: "country", placeholder: "Country" },
                    { name: "zip", placeholder: "Zip Code" },
                  ].map((field) => (
                    <input
                      key={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      className="border p-2 w-full mb-2"
                      value={editData[field.name] || ""}
                      onChange={handleEditChange}
                    />
                  ))}

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSave(a.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View mode */}
                  <h3 className="font-semibold">{a.fullName}</h3>
                  <p>{a.phone}</p>
                  <p>{a.street}</p>
                  <p>
                    {a.city}, {a.state}, {a.country} - {a.zip}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => dispatch(removeAddress(a.id))}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(a.id);
                        setEditData(a);
                      }}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No addresses saved yet.</p>
        )}
      </div>

      {/* Add New Address */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Add New Address</h3>

        {[
          { name: "fullName", placeholder: "Full Name" },
          { name: "phone", placeholder: "Phone" },
          { name: "street", placeholder: "Street" },
          { name: "city", placeholder: "City" },
          { name: "state", placeholder: "State" },
          { name: "country", placeholder: "Country" },
          { name: "zip", placeholder: "Zip Code" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            className="border p-2 w-full mb-2"
            value={newAddress[field.name]}
            onChange={handleChange}
          />
        ))}

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default Address;