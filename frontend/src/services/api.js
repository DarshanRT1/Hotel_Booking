// API service for handling all backend requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return text;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

// Menu Items API
export const menuAPI = {
  getAllItems: async () => {
    const response = await fetch(`${API_BASE_URL}/menu-items`);
    return handleResponse(response);
  },

  getItemsByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/category/${category}`);
    return handleResponse(response);
  },

  getItemById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`);
    return handleResponse(response);
  },
};

// Reservations API
export const reservationsAPI = {
  create: async (reservationData) => {
    console.log('API: Creating reservation with data:', reservationData);
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    console.log('API: Response status:', response.status);
    return handleResponse(response);
  },

  getUserReservations: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/reservations/user/${userId}`);
    return handleResponse(response);
  },

  getReservationsByEmail: async (email) => {
    const response = await fetch(`${API_BASE_URL}/reservations/email/${email}`);
    return handleResponse(response);
  },

  updateStatus: async (reservationId, status) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  getUserOrders: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    return handleResponse(response);
  },

  getOrdersByEmail: async (email) => {
    const response = await fetch(`${API_BASE_URL}/orders/email/${email}`);
    return handleResponse(response);
  },

  updateStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};