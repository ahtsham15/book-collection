import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { PublishersTableView } from "@/features/publisher/publisherTableView";

export function PublisherPage() {
  return (
    <DashboardLayout title="Publishers">
      <div className="p-6">
        <PublishersTableView />
      </div>
    </DashboardLayout>
  );
}