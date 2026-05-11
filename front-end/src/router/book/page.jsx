import { useState } from "react";
import { DashboardLayout } from "../../components/layout/dashboardLayout";
import { BooksTableView } from "@/features/book/booksTableView";
import { BookEditData } from "@/features/book/bookEditData";

export function BooksPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleViewBook = (book) => {
    console.log("View book", book);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <DashboardLayout title="Books">
      <div className="p-6">
        <BooksTableView
          onEditBook={handleEditBook}
          onViewBook={handleViewBook}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <BookEditData
        book={selectedBook}
        isOpen={isModalOpen}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
}
