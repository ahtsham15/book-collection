import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "./dashboardApi";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });
};
