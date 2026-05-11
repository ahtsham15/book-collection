import { apiClient } from "../apiClient";

export const getDashboardStats = async () => {
  try {
    const response = await apiClient("/auth/dashboard/stats", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};