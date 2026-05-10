import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAuthor, useUpdateAuthor } from "@/lib/api/author/authorHooks";

export const AuthorEditData = ({ author, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    birthDate: "",
    nationality: "",
  });

  const [originalData, setOriginalData] = useState({});
  const { mutate: createAuthor, isLoading: isCreating } = useCreateAuthor();
  const { mutate: updateAuthor, isLoading: isUpdating } = useUpdateAuthor();
  const isLoading = isCreating || isUpdating;

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 3000);
  };

  useEffect(() => {
    if (author) {
      let formattedDate = author.birthDate || "";
      if (author.birthDate && author.birthDate.includes('/')) {
        const parts = author.birthDate.split('/');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      const authorData = {
        firstName: author.firstName || "",
        lastName: author.lastName || "",
        email: author.email || "",
        bio: author.bio || "",
        birthDate: formattedDate,
        nationality: author.nationality || "",
      };
      
      setFormData(authorData);
      setOriginalData(authorData);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        birthDate: "",
        nationality: "",
      });
      setOriginalData({});
    }
  }, [author]);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the data for submission
    const submitData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      bio: formData.bio.trim(),
      nationality: formData.nationality.trim(),
    };
    
    // Add birthDate only if it exists
    if (formData.birthDate) {
      // Convert YYYY-MM-DD to DD/MM/YYYY format
      const dateParts = formData.birthDate.split('-');
      if (dateParts.length === 3) {
        submitData.birthDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      } else {
        submitData.birthDate = formData.birthDate;
      }
    }
    
    // For update: Only include email if it has changed
    if (author?._id) {
      // Check if email changed
      if (formData.email.trim() !== originalData.email) {
        submitData.email = formData.email.trim();
      }
      
      // Log what's being updated
      console.log("Updating ONLY changed fields:", submitData);
      
      updateAuthor(
        { id: author._id, data: submitData },
        {
          onSuccess: () => {
            showNotification("Author updated successfully", "success");
            onSave?.();
            onCancel();
          },
          onError: (error) => {
            console.error("Update error:", error);
            showNotification(error.response?.message || "Failed to update author", "error");
          },
        }
      );
    } else {
      submitData.email = formData.email.trim();
      
      console.log("Creating author with data:", submitData);
      
      createAuthor(submitData, {
        onSuccess: () => {
          showNotification("Author created successfully", "success");
          onSave?.();
          onCancel();
        },
        onError: (error) => {
          console.error("Create error:", error);
          showNotification(error.response?.message || "Failed to create author", "error");
        },
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
        <h2 className="text-lg font-semibold mb-4">{author ? "Edit Author" : "Add New Author"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={!!author}
                className={author ? "bg-gray-100 cursor-not-allowed" : ""}
              />
              {author && (
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed to prevent duplicates
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
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
              {isLoading ? "Saving..." : author ? "Update Author" : "Create Author"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};