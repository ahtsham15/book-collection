import { apiClient } from "../apiClient";

const PUBLISHER_API_BASE = "/api/publishers";

export const publisherApi = {
  getAllPublishers: async () => {
    const response = await apiClient(PUBLISHER_API_BASE, { method: "GET" });
    console.log("Publishers Response:", response);
    const publishers = response?.data || response?.data?.data;
    return Array.isArray(publishers) ? publishers : [];
  },
};
