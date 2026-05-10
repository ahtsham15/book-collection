import { apiClient } from "../apiClient";

const AUTHOR_API_BASE = "/api/authors";

export const authorApi = {
  getAllAuthors: async () => {
    const response = await apiClient(AUTHOR_API_BASE, { method: "GET" });
    console.log("Authors Response:", response);
    const authors = response?.data?.authors || response?.data?.data?.authors;
    return Array.isArray(authors) ? authors : [];
  },
};
