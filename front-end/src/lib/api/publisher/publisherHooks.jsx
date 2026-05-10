import { useQuery } from "@tanstack/react-query";
import { publisherApi } from "./publisherApi";

export const usePublishers = () => {
  return useQuery({
    queryKey: ["publishers"],
    queryFn: publisherApi.getAllPublishers,
  });
};
