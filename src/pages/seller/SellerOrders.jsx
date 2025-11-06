import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../redux/slices/sellerOrderSlice";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, updating } = useSelector((state) => state.sellerOrder);


  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm("Are you sure you want to update this order's status?")) {
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
    }
  };

  const orderList = orders?.content || [];

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Seller Orders</h2>
      {loading && <p className="text-blue-500">Loading orders...</p>}
      {error && (
        <p className="text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
          {error}
        </p>
      )}
      {!loading && !error && orderList.length === 0 && (
        <p className="text-gray-500 text-sm">No orders found.</p>
      )}
      {orderList.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Products</th>
                <th className="p-3 border">Customer ID</th>
                <th className="p-3 border">Total Price</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border text-gray-700">{order.id}</td>
                  <td className="p-3 border text-gray-700">
                    {order.items?.map((item) => item.productName).join(", ") || "—"}
                  </td>
                  <td className="p-3 border text-gray-700">{order.customerId}</td>
                  <td className="p-3 border text-gray-700">₹{order.totalPrice}</td>
                  <td className="p-3 border text-gray-700">{order.orderStatus}</td>

                  <td className="p-3 border">
                    <select
                      value={order.orderStatus}
                      disabled={updating}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border p-1 rounded-md bg-white text-gray-700"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;