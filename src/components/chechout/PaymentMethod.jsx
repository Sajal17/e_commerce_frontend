import React from "react";

const PaymentMethod = ({ paymentMethod, setPaymentMethod, onNext, onBack }) => {
  return (
    <div className="mt-4 space-y-3">
      <label className="flex items-center gap-3">
        <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
        Cash on Delivery
      </label>
      {/* <label className="flex items-center gap-3">
        <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} />
        Credit / Debit Card
      </label> */}
      <label className="flex items-center gap-3">
        <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={(e) => setPaymentMethod(e.target.value)} />
        UPI / Wallets
      </label>

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="bg-gray-300 px-4 py-2 rounded">
          Back
        </button>
        <button onClick={onNext} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
