import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { AuthorsTableView } from "@/features/author/authorTableView";

export function AuthorPage() {
  return (
    <DashboardLayout title="Authors">
        <div className="p-6">
      <AuthorsTableView />
      </div>
    </DashboardLayout>
  );
}
