const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith("/api") ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : "http://localhost:5000/api";

// Helper for making API requests with JWT Auth token
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("la_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json();
    
    if (!res.ok) {
      const err = new Error(data.error || "An error occurred");
      err.pendingApproval = data.pendingApproval;
      throw err;
    }
    
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, err);
    throw err;
  }
}

const api = {
  // 🔐 Authentication
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  getProfile: () => request("/auth/profile"),
  getCustomers: () => request("/auth/customers"),
  sendCustomerEmail: (data) => request("/auth/send-email", { method: "POST", body: JSON.stringify(data) }),

  // 🛡️ Admin Seller Management
  getAllSellers: () => request("/auth/sellers"),
  updateSellerApproval: (id, approval_status) => request(`/auth/sellers/${id}/approval`, { method: "PATCH", body: JSON.stringify({ approval_status }) }),
  updateSellerSubscription: (id, subscription_status, subscription_plan) => request(`/auth/sellers/${id}/subscription`, { method: "PATCH", body: JSON.stringify({ subscription_status, subscription_plan }) }),

  // 🏪 Seller Portal Endpoints
  getSellerStats: () => request("/seller/stats"),
  getSellerProducts: () => request("/seller/products"),
  getSellerOrders: () => request("/seller/orders"),
  getSellerCustomers: () => request("/seller/customers"),
  getSellerSubscription: () => request("/seller/subscription"),

  // 📦 Products Catalogue (Multi-vendor)
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ""}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (productData) => request("/products", { method: "POST", body: JSON.stringify(productData) }),
  updateProduct: (id, productData) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(productData) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // 🛍️ Orders Management
  createOrder: (orderData) => request("/orders", { method: "POST", body: JSON.stringify(orderData) }),
  getMyOrders: () => request("/orders/my-orders"),
  getAllOrders: () => request("/orders"),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // ✉️ Inquiries & Messages
  sendInquiry: (messageData) => request("/messages", { method: "POST", body: JSON.stringify(messageData) }),
  getAllMessages: () => request("/messages"),
  replyToMessage: (id, replyMessage) => request(`/messages/${id}/reply`, { method: "POST", body: JSON.stringify({ replyMessage }) }),

  // 📊 Dashboard Analytics
  getDashboardStats: () => request("/stats"),
};

export default api;