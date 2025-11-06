import React from "react";

const CheckoutPopup = ({
  cartItems,
  totalPrice,
  address,
  paymentMethod,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Confirm Your Order
        </h2>
        <div className="border-b pb-3 mb-3">
          <h3 className="font-semibold mb-1">Shipping To:</h3>
          <p>{address.fullName}</p>
          <p>
            {address.street}, {address.city}, {address.state} - {address.zip}
          </p>
          <p> {address.phone}</p>
        </div>
        <div className="border-b pb-3 mb-3">
          <h3 className="font-semibold mb-1">Payment Method:</h3>
          <p>
            {paymentMethod === "cod"
              ? "Cash on Delivery"
              // : paymentMethod === "card"
              // ? "Credit / Debit Card"
              : "UPI / Wallet"}
          </p>
        </div>
        <div className="border-b pb-3 mb-3 max-h-40 overflow-y-auto">
          <h3 className="font-semibold mb-2">Items:</h3>
          {cartItems.map((item) => (
            <div key={item.id || item.productId || item.name} 
                 className="flex justify-between mb-1 text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Placing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;