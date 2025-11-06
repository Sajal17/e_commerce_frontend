import React from "react";

const ReviewOrder = ({ cartItems, address, paymentMethod, totalPrice, loading, onBack, onConfirm }) => {
  return (
    <div className="mt-4">
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id || item.productId || item.name} 
                 className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <img
                src={
  item.imageData
    ? `data:${item.imageType};base64,${item.imageData}`
    : item.imageUrl
    ? item.imageUrl
    : item.imageName
    ? `${import.meta.env.VITE_API_URL}/images/${item.imageName}`
    : "/default_product.png"
}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold">₹ {(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right border-t pt-3">
        <p className="text-lg font-semibold">Total: ₹ {totalPrice.toLocaleString()}</p>
      </div>
      <div className="mt-6 text-sm text-gray-700">
        <p><strong>Address:</strong> {address.fullName}, {address.street}, {address.city}</p>
        <p><strong>Payment:</strong> {paymentMethod.toUpperCase()}</p>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="bg-gray-300 px-4 py-2 rounded">
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default ReviewOrder;