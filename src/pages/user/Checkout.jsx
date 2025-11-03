import React, { useState, useEffect } from "react";
import AddressForm from "../../components/chechout/AddressForm";
import PaymentMethod from "../../components/chechout/PaymentMethod";
import ReviewOrder from "../../components/chechout/ReviewOrder";
import { useSelector, useDispatch } from "react-redux";
import { placeOrder } from "../../redux/slices/orderSlice";
import { clearCartAsync } from "../../redux/slices/cartSlice";
import { loadAddresses, createAddress } from "../../redux/slices/addressSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const { addresses, loading: addressLoading } = useSelector(
    (state) => state.address
  );

  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(loadAddresses());
  }, [dispatch]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleAddAddress = async () => {
    await dispatch(createAddress(newAddress));
    setNewAddress({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    });
    setAddingNew(false);
  };

  const handleConfirm = async () => {
    try {
      if (!selectedAddress) {
        alert("Please select a delivery address.");
        return;
      }

      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const customerId = user?.id;
     console.log("Cart items before order:", cartItems);
      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl || null,
        imageName: item.imageName || null,
        imageData: item.imageData || null,
        imageType: item.imageType || null,
      }));

      const orderData = {
        customerId,
        items,
        shippingAddress: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zip}`,
        paymentMethod,
      };
      console.log("Sending orderData:", JSON.stringify(orderData, null, 2));
      await dispatch(placeOrder(orderData)).unwrap();
      dispatch(clearCartAsync());
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Address Section */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <h2 className="text-lg font-semibold mb-2"> Delivery Address</h2>

        {addressLoading ? (
          <p>Loading addresses...</p>
        ) : (
          <>
            {addresses?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border rounded-lg p-3 cursor-pointer transition ${
                      selectedAddress?.id === addr.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <h3 className="font-semibold">{addr.fullName}</h3>
                    <p>{addr.phone}</p>
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state}, {addr.country} - {addr.zip}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No addresses found. Please add one.</p>
            )}

            {!addingNew ? (
              <button
                onClick={() => setAddingNew(true)}
                className="text-blue-600 border border-blue-600 px-3 py-1 rounded"
              >
                + Add New Address
              </button>
            ) : (
              <div className="mt-4">
                <AddressForm
                  address={newAddress}
                  setAddress={setNewAddress}
                  onNext={handleAddAddress}
                />
                <button
                  className="text-gray-600 text-sm mt-2"
                  onClick={() => setAddingNew(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {selectedAddress && (
              <button
                onClick={() => setActiveStep(2)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Deliver to this Address
              </button>
            )}
          </>
        )}
      </div>

      {/* Payment Section */}
      {activeStep >= 2 && (
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <h2 className="text-lg font-semibold mb-2"> Payment Method</h2>
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onNext={() => setActiveStep(3)}
            onBack={() => setActiveStep(1)}
          />
        </div>
      )}

      {/* Review Section */}
      {activeStep === 3 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">3️⃣ Review & Place Order</h2>
          <ReviewOrder
            cartItems={cartItems}
            address={selectedAddress}
            paymentMethod={paymentMethod}
            totalPrice={totalPrice}
            loading={loading}
            onBack={() => setActiveStep(2)}
            onConfirm={handleConfirm}
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;