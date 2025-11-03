// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader.jsx";
import API from "../../api/axiosInstance"; // ✅ use configured instance

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setIsError(false);

      try {
        console.log("Fetching orders for user:", user.id);
        const res = await API.get(`/orders/customer/${user.id}`); // ✅ Auth handled by interceptor
        console.log("Fetched orders (detailed):", JSON.stringify(res.data, null, 2));
        
        setOrders(res.data.content || res.data || []); // ✅ handles both Page<> and list responses
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (isLoading) return <Loader size={32} color="blue" />;

  if (isError)
    return (
      <div className="text-center mt-20 text-red-500">
        Failed to load orders. Please try again later.
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center mt-20 text-gray-500">
        You have not placed any orders yet.
      </div>
    );

  return (
    <main className="pt-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Order ID: {order.id}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {order.items?.map((item, index) => (
                <div
                  key={`${order.id}-${item.id || index}`}
                  className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-2 rounded"
                >
                  <img
                    src={item.imageUrl || "/default_product.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Price: ₹ {item.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="flex justify-end mt-2 font-semibold text-gray-800 dark:text-gray-200">
              Total: ₹ {order.total?.toLocaleString()}
            </div> */}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Orders;