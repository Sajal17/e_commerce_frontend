import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../../components/Cart/CartItem";
import { loadCart } from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, loading, error } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading cart...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">
       Shopping Bag ({cartItems.length})
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-20">Your cart is empty</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const key = item.id || item._id || item.productId;
              return <CartItem key={key} item={item} />;
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                PRICE DETAILS
              </h3>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹ {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-gray-900 text-lg">
                  <span>Total Amount</span>
                  <span>₹ {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Safe and secure payments. 100% Authentic products.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;