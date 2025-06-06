import axios from "axios";

// Base URL for the mock API server
const API_BASE_URL = "http://localhost:3001";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication (if needed)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    try {
      const { data: users } = await apiClient.get("/users");
      const user = users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        // Simulate JWT token
        const token = btoa(
          JSON.stringify({ userId: user.id, userType: user.userType })
        );
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return { success: true, user, token };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  },

  register: async (userData) => {
    try {
      const { data: users } = await apiClient.get("/users");

      // Check if user already exists
      const existingUser = users.find((u) => u.email === userData.email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        ...userData,
        profileId: users.length + 1,
      };

      const response = await apiClient.post("/users", newUser);

      // Auto login after registration
      const token = btoa(
        JSON.stringify({ userId: newUser.id, userType: newUser.userType })
      );
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      return { success: true, user: response.data, token };
    } catch (error) {
      throw new Error("Registration failed: " + error.message);
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};

// Entrepreneurs API
export const entrepreneursAPI = {
  getAll: async () => {
    const response = await apiClient.get("/entrepreneurs");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/entrepreneurs/${id}`);
    return response.data;
  },

  create: async (entrepreneurData) => {
    const response = await apiClient.post("/entrepreneurs", entrepreneurData);
    return response.data;
  },

  update: async (id, entrepreneurData) => {
    const response = await apiClient.put(
      `/entrepreneurs/${id}`,
      entrepreneurData
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/entrepreneurs/${id}`);
    return response.data;
  },
};

// Investors API
export const investorsAPI = {
  getAll: async () => {
    const response = await apiClient.get("/investors");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/investors/${id}`);
    return response.data;
  },

  create: async (investorData) => {
    const response = await apiClient.post("/investors", investorData);
    return response.data;
  },

  update: async (id, investorData) => {
    const response = await apiClient.put(`/investors/${id}`, investorData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/investors/${id}`);
    return response.data;
  },
};

// Collaboration Requests API
export const collaborationAPI = {
  getAll: async () => {
    const response = await apiClient.get("/collaborationRequests");
    return response.data;
  },

  getByEntrepreneurId: async (entrepreneurId) => {
    const response = await apiClient.get(
      `/collaborationRequests?entrepreneurId=${entrepreneurId}`
    );
    return response.data;
  },

  getByInvestorId: async (investorId) => {
    const response = await apiClient.get(
      `/collaborationRequests?investorId=${investorId}`
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/collaborationRequests/${id}`);
    return response.data;
  },

  create: async (requestData) => {
    const response = await apiClient.post(
      "/collaborationRequests",
      requestData
    );
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/collaborationRequests/${id}`, {
      status,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/collaborationRequests/${id}`);
    return response.data;
  },
};

// Combined API for dashboard data
export const dashboardAPI = {
  getInvestorDashboardData: async () => {
    try {
      const [entrepreneurs, investors] = await Promise.all([
        entrepreneursAPI.getAll(),
        investorsAPI.getAll(),
      ]);

      return {
        entrepreneurs,
        totalEntrepreneurs: entrepreneurs.length,
        investmentOpportunities: entrepreneurs.filter((e) =>
          ["Seed", "Series A"].includes(e.stage)
        ).length,
        portfolioValue: "$2.5M", // This would be calculated based on actual investments
      };
    } catch (error) {
      throw new Error(
        "Failed to fetch investor dashboard data: " + error.message
      );
    }
  },

  getEntrepreneurDashboardData: async (entrepreneurId) => {
    try {
      const [requests, investors] = await Promise.all([
        collaborationAPI.getByEntrepreneurId(entrepreneurId),
        investorsAPI.getAll(),
      ]);

      // Enrich requests with investor data
      const enrichedRequests = requests.map((request) => {
        const investor = investors.find((inv) => inv.id === request.investorId);
        return {
          ...request,
          investorName: investor?.name || "Unknown",
          company: investor?.company || "Unknown",
          profileSnippet: investor?.profileSnippet || "",
          avatar: investor?.avatar || "XX",
          investmentRange: investor?.investmentRange || "N/A",
        };
      });

      return {
        collaborationRequests: enrichedRequests,
        totalRequests: enrichedRequests.length,
        pendingRequests: enrichedRequests.filter((r) => r.status === "pending")
          .length,
        acceptedRequests: enrichedRequests.filter(
          (r) => r.status === "accepted"
        ).length,
      };
    } catch (error) {
      throw new Error(
        "Failed to fetch entrepreneur dashboard data: " + error.message
      );
    }
  },
};

// Utility functions
export const apiUtils = {
  handleApiError: (error) => {
    if (error.response) {
      // Server responded with error status
      return error.response.data.message || "Server error occurred";
    } else if (error.request) {
      // Request was made but no response received
      return "Network error - please check your connection";
    } else {
      // Something else happened
      return error.message || "An unexpected error occurred";
    }
  },

  isServerRunning: async () => {
    try {
      await apiClient.get("/entrepreneurs");
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default apiClient;
