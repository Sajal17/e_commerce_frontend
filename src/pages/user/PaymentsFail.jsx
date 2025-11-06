import React from "react";
import { Link } from "react-router-dom";

const PaymentFail = () => {
  return (
    <main className="pt-20 max-w-4xl mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Payment Failed
      </h1>
      <p className="mb-6">Oops! Something went wrong while processing your payment.</p>
      <div className="flex justify-center gap-4">
        <Link
          to="/cart"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Retry Payment
        </Link>
        <Link
          to="/"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default PaymentFail;