import { useState } from "react";
import { CustomTable } from "@/components/common/customTable";
import { PUBLISHERS_COLUMNS } from "./publisherTableConfig";
import { PublisherEditData } from "./publisherEditData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePublishers, useDeletePublisher } from "@/lib/api/publisher/publisherHooks";

export const PublishersTableView = () => {
  const { data: publishersData, isLoading, refetch } = usePublishers();
  const { mutate: deletePublisher } = useDeletePublisher();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 3000);
  };

  const handleOpenCreateModal = () => {
    setSelectedPublisher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (publisher) => {
    setSelectedPublisher(publisher);
    setIsModalOpen(true);
  };

  const handleDelete = (publisher) => {
    if (window.confirm(`Are you sure you want to delete "${publisher.name}"?`)) {
      deletePublisher(publisher._id, {
        onSuccess: () => {
          showNotification(`"${publisher.name}" deleted successfully`, "success");
          refetch();
        },
        onError: () => showNotification("Failed to delete publisher", "error"),
      });
    }
  };

  const transformedData = publishersData?.map(publisher => ({
    ...publisher,
    name: publisher.name || "N/A",
    contactEmail: publisher.contactEmail || "-",
    phone: publisher.phone || "-",
    foundedYear: publisher.foundedYear || "-",
  })) || [];

  return (
    <div className="w-full overflow-x-auto">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : notification.type === "error"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Publisher
        </Button>
      </div>

      <CustomTable
        data={transformedData}
        columns={PUBLISHERS_COLUMNS}
        onEditRow={handleEdit}
        onDeleteRow={handleDelete}
        isLoading={isLoading}
        stickyColumn="name"
        actionButtons={["edit", "delete"]}
        emptyMessage="No publishers found. Add your first publisher!"
        rowKey="_id"
      />

      <PublisherEditData
        publisher={selectedPublisher}
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedPublisher(null);
        }}
        onSave={refetch}
      />
    </div>
  );
};