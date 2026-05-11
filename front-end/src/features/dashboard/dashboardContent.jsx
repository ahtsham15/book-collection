import { Package, Users, Calculator, TrendingUp, Award, BookOpen, User, Building } from "lucide-react";
import { MetricCard } from "./matricCard";
import { AsinOverviewChart } from "./bookOverviewChart";
import { useDashboardStats } from "@/lib/api/dashboard/dashboardHooks";

export function DashboardContent() {
  const { data, isLoading, error } = useDashboardStats();
  

  const dashboardData = data?.data || {
    totalBooks: 0,
    totalAuthors: 0,
    totalPublishers: 0,
  };

  const AllMetrics = [
    {
      title: "Total Books",
      value: dashboardData.totalBooks,
      icon: BookOpen,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Authors",
      value: dashboardData.totalAuthors,
      icon: User,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Publishers",
      value: dashboardData.totalPublishers,
      icon: Building,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AllMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      <div className="mt-8">
        <AsinOverviewChart />
      </div>
    </div>
  );
}