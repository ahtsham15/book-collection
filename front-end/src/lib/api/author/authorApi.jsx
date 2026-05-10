import { apiClient } from "../apiClient";

const AUTHOR_API_BASE = "/api/authors";

export const authorApi = {
  getAllAuthors: async () => {
    const response = await apiClient(AUTHOR_API_BASE, { method: "GET" });
    const authors = response?.data?.authors || response?.data?.data?.authors;
    return Array.isArray(authors) ? authors : [];
  },

  createAuthor: async (data) => {
    console.log("Creating author with data:", data);
    const response = await apiClient(AUTHOR_API_BASE, {
      method: "POST",
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  },

  updateAuthor: async ({ id, data }) => {
    if (!id || !data) throw new Error("updateAuthor: Missing id or data");
    console.log("Updating author with data:", data);
    try {
      const response = await apiClient(`${AUTHOR_API_BASE}/${id}`, {
        method: "PATCH",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response?.data;
    } catch (error) {
      if (error.response?.message?.includes("Email already exists")) {
        console.log("Email error detected, retrying without email field");
        const { email, ...dataWithoutEmail } = data;
        const response = await apiClient(`${AUTHOR_API_BASE}/${id}`, {
          method: "PATCH",
          body: dataWithoutEmail,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response?.data;
      }
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    if (!id) throw new Error("deleteAuthor: Missing id");
    const response = await apiClient(`${AUTHOR_API_BASE}/${id}`, {
      method: "DELETE",
    });
    return response?.data;
  },
};