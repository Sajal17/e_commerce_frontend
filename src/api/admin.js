export const getUserById = (id) => API.get(`/user/${id}`);
export const updateUser = (id, data) => API.put(`/user/${id}`, data);
export const fetchUsers = () => API.get("/users");   // <-- Not fetchAllUsers
export const deleteUser = (id) => API.delete(`/user/${id}`);

export const fetchAllSellers = () => API.get("/admin/sellers");
export const updateSellerStatus = (sellerId, status) => API.put(`/admin/sellers/${sellerId}`, { status });
export const deleteSeller = (id) => API.delete(`/admin/sellers/${id}`);

export const fetchAllProducts = () => API.get("/admin/products");
export const deleteProductByAdmin = (id) => API.delete(`/admin/products/${id}`);

export const fetchAllOrders = () => API.get("/admin/orders");
export const updateOrderStatus = (orderId, status) => API.put(`/admin/orders/${orderId}`, { status });

export const approveSeller = (sellerId) => updateSellerStatus(sellerId, "APPROVED");
