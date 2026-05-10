import { useState, useEffect } from "react";
import { CustomTable } from "@/components/common/customTable";
import { BOOKS_COLUMNS } from "./booksTableConfig";
import { BookEditData } from "./bookEditData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBooks, useDeleteBook } from "@/lib/api/book/bookHooks";

export const BooksTableView = ({ onEditBook, onViewBook }) => {
  const { data: booksData, isLoading, refetch } = useBooks();
  console.log("The book data: ",booksData)
  const { mutate: deleteBook } = useDeleteBook();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const books = (booksData || []).map(book => {
    const authorName =
      book.author?.name ||
      book.author?.firstName ||
      "N/A";
    const publisherName =
      book.publisher?.name || "N/A";
    const genreNames =
      Array.isArray(book.genres) && book.genres.length > 0
        ? book.genres.map(g => g.name || "N/A").join(", ")
        : "N/A";
    return {
      ...book,
      authorName,
      publisherName,
      genreNames,
    };
  });
  console.log("The books data", books)

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 3000);
  };

  const handleOpenCreateModal = () => {
    setSelectedBook(null);
    setIsBookModalOpen(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  const handleView = (book) => {
    onViewBook?.(book);
  };

  const handleDelete = (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      deleteBook(book._id, {
        onSuccess: () => {
          showNotification(`"${book.title}" deleted successfully`, "success");
          refetch();
        },
        onError: () => showNotification("Failed to delete book", "error"),
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
          Create New Book
        </Button>
      </div>

      <CustomTable
        data={books}
        columns={BOOKS_COLUMNS}
        onEditRow={handleEdit}
        onViewRow={handleView}
        onDeleteRow={handleDelete}
        isLoading={isLoading}
        stickyColumn="title"
        actionButtons={["view", "edit", "delete"]}
        emptyMessage="No books found. Add your first book!"
        rowKey="_id"
      />

      <BookEditData
        book={selectedBook}
        isOpen={isBookModalOpen}
        onCancel={() => {
          setIsBookModalOpen(false);
          setSelectedBook(null);
        }}
        onSave={refetch}
      />
    </div>
  );
};
