import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authorApi } from "./authorApi";

export const useAuthors = () => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: authorApi.getAllAuthors,
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.createAuthor,
    onSuccess: () => queryClient.invalidateQueries(["authors"]),
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.updateAuthor,
    onSuccess: () => queryClient.invalidateQueries(["authors"]),
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.deleteAuthor,
    onSuccess: () => queryClient.invalidateQueries(["authors"]),
  });
};
