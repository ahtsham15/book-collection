import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "./bookApi";

export const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: bookApi.getAllBooks,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookApi.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bookApi.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookApi.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
    },
  });
};
