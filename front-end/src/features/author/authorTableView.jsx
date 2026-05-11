import { useState } from "react";
import { CustomTable } from "@/components/common/customTable";
import { AUTHORS_COLUMNS } from "./authorTableConfig";
import { AuthorEditData } from "./authorEditData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthors, useDeleteAuthor } from "@/lib/api/author/authorHooks";

export const AuthorsTableView = () => {
  const { data: authorsData, isLoading, refetch } = useAuthors();
  const { mutate: deleteAuthor } = useDeleteAuthor();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 3000);
  };

  const handleOpenCreateModal = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (author) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleDelete = (author) => {
    if (window.confirm(`Are you sure you want to delete "${author.firstName} ${author.lastName}"?`)) {
      deleteAuthor(author._id, {
        onSuccess: () => {
          showNotification(`"${author.firstName}" deleted successfully`, "success");
          refetch();
        },
        onError: () => showNotification("Failed to delete author", "error"),
      });
    }
  };

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
          Create New Author
        </Button>
      </div>

      <CustomTable
        data={authorsData || []}
        columns={AUTHORS_COLUMNS}
        onEditRow={handleEdit}
        onDeleteRow={handleDelete}
        isLoading={isLoading}
        stickyColumn="firstName"
        actionButtons={["edit", "delete"]}
        emptyMessage="No authors found. Add your first author!"
        rowKey="_id"
      />

      <AuthorEditData
        author={selectedAuthor}
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedAuthor(null);
        }}
        onSave={refetch}
      />
    </div>
  );
};
