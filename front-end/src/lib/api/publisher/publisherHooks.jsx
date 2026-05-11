import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { publisherApi } from "./publisherApi";

export const usePublishers = () => {
  return useQuery({
    queryKey: ["publishers"],
    queryFn: publisherApi.getAllPublishers,
  });
};

export const useCreatePublisher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publisherApi.createPublisher,
    onSuccess: () => queryClient.invalidateQueries(["publishers"]),
  });
};

export const useUpdatePublisher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publisherApi.updatePublisher,
    onSuccess: () => queryClient.invalidateQueries(["publishers"]),
  });
};

export const useDeletePublisher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publisherApi.deletePublisher,
    onSuccess: () => queryClient.invalidateQueries(["publishers"]),
  });
};