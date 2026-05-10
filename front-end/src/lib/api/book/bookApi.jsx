import { apiClient } from "../apiClient";

const BOOK_API_BASE = "/api/books";

export const bookApi = {
  createBook: async (bookData) => {
    const response = await apiClient(BOOK_API_BASE, {
      method: "POST",
      body: bookData,
    });
    console.log("Create Book Response:", response);
    return response?.data || response;
  },

  getAllBooks: async () => {
    const response = await apiClient(BOOK_API_BASE, { method: "GET" });
    console.log("Get All Books Response:", response);

    const books = response?.data?.books;
    if (Array.isArray(books)) return books;

    console.warn("Unexpected books response format:", response);
    return [];
  },

  updateBook: async (bookId, bookData) => {
    const response = await apiClient(`${BOOK_API_BASE}/${bookId}`, {
      method: "PATCH",
      body: bookData,
    });
    console.log("Update Book Response:", response);
    return response?.data || response;
  },

  deleteBook: async (bookId) => {
    const response = await apiClient(`${BOOK_API_BASE}/${bookId}`, {
      method: "DELETE",
    });
    console.log("Delete Book Response:", response);
    return response?.data || response;
  },
};
