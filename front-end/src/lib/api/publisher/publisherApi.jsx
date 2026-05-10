// import { apiClient } from "../apiClient";

// const PUBLISHER_API_BASE = "/api/publishers";

// export const publisherApi = {
//   getAllPublishers: async () => {
//     const response = await apiClient(PUBLISHER_API_BASE, { method: "GET" });
//     console.log("Publishers Response:", response);
//     const publishers = response?.data || response?.data?.data;
//     return Array.isArray(publishers) ? publishers : [];
//   },
// };


import { apiClient } from "../apiClient";

const PUBLISHER_API_BASE = "/api/publishers";

export const publisherApi = {
  getAllPublishers: async () => {
    const response = await apiClient(PUBLISHER_API_BASE, { method: "GET" });
    console.log("Publishers Response:", response);
    const publishers = response?.data?.publishers || response?.data?.data?.publishers || response?.data;
    return Array.isArray(publishers) ? publishers : [];
  },

  createPublisher: async (data) => {
    console.log("Creating publisher with data:", data);
    const response = await apiClient(PUBLISHER_API_BASE, {
      method: "POST",
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  },

  updatePublisher: async ({ id, data }) => {
    if (!id || !data) throw new Error("updatePublisher: Missing id or data");
    console.log("Updating publisher with data:", data);
    const response = await apiClient(`${PUBLISHER_API_BASE}/${id}`, {
      method: "PATCH",
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  },

  deletePublisher: async (id) => {
    if (!id) throw new Error("deletePublisher: Missing id");
    const response = await apiClient(`${PUBLISHER_API_BASE}/${id}`, {
      method: "DELETE",
    });
    return response?.data;
  },
};