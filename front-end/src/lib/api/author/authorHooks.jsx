import { useQuery } from "@tanstack/react-query";
import { authorApi } from "./authorApi";

export const useAuthors = () => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: authorApi.getAllAuthors,
  });
};
