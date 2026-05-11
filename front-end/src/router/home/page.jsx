import { DashboardLayout } from "../../components/layout/dashboardLayout";
import { DashboardContent } from "@/features/dashboard/dashboardContent";

export function HomePage() {
  return (
    <DashboardLayout title="Dashboard">
      <DashboardContent />
    </DashboardLayout>
  );
}
