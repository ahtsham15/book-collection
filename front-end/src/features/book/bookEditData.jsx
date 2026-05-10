import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBook, useUpdateBook } from "@/lib/api/book/bookHooks";
import { useAuthors } from "@/lib/api/author/authorHooks";
import { usePublishers } from "@/lib/api/publisher/publisherHooks";

export const BookEditData = ({ book, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    title: "",
    ISBN: "",
    author: "",
    genres: [],
    publisher: "",
    publicationDate: "",
    language: "English",
    pages: "",
    description: "",
    price: "",
    quantity: "",
  });

  const { mutate: createBook, isLoading: isCreating } = useCreateBook();
  const { mutate: updateBook, isLoading: isUpdating } = useUpdateBook();
  const isLoading = isCreating || isUpdating;

  const { data: authorsData, isLoading: isAuthorsLoading } = useAuthors();
  const { data: publishersData, isLoading: isPublishersLoading } = usePublishers();

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "info" }),
      3000
    );
  };

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        ISBN: book.ISBN || "",
        author: book.author?._id || "",
        genres: book.genres?.map((g) => g._id) || [],
        publisher: book.publisher?._id || "",
        publicationDate: book.publicationDate || "",
        language: book.language || "English",
        pages: book.pages || "",
        description: book.description || "",
        price: book.price || "",
        quantity: book.quantity || "",
      });
    } else {
      setFormData({
        title: "",
        ISBN: "",
        author: "",
        genres: [],
        publisher: "",
        publicationDate: "",
        language: "English",
        pages: "",
        description: "",
        price: "",
        quantity: "",
      });
    }
  }, [book]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      pages: Number(formData.pages),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    ["author", "publisher", "genres"].forEach((field) => {
      const value = payload[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        delete payload[field];
      }
    });

    if (book?._id) {
      updateBook(
        { id: book._id, data: payload },
        {
          onSuccess: () => {
            showNotification("Book updated successfully", "success");
            onSave?.();
            onCancel();
          },
          onError: () => showNotification("Failed to update book", "error"),
        }
      );
    } else {
      createBook(payload, {
        onSuccess: () => {
          showNotification("Book created successfully", "success");
          onSave?.();
          onCancel();
        },
        onError: () => showNotification("Failed to create book", "error"),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

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

      <div className="relative bg-white shadow-lg rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold mb-4">
          {book ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.ISBN}
                onChange={(e) => handleChange("ISBN", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Select
                value={formData.author}
                onValueChange={(value) => handleChange("author", value)}
                disabled={isAuthorsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Author" />
                </SelectTrigger>
                <SelectContent>
                  {authorsData?.map((author) => (
                    <SelectItem key={author._id} value={author._id}>
                      {author.firstName} {author.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <Select
                value={formData.publisher}
                onValueChange={(value) => handleChange("publisher", value)}
                disabled={isPublishersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Publisher" />
                </SelectTrigger>
                <SelectContent>
                  {publishersData?.map((publisher) => (
                    <SelectItem key={publisher._id} value={publisher._id}>
                      {publisher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="date"
                value={formData.publicationDate}
                onChange={(e) =>
                  handleChange("publicationDate", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="pages">Pages</Label>
              <Input
                id="pages"
                type="number"
                value={formData.pages}
                onChange={(e) => handleChange("pages", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white"
            >
              {isLoading ? "Saving..." : book ? "Update Book" : "Create Book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
