import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePublisher, useUpdatePublisher } from "@/lib/api/publisher/publisherHooks";

export const PublisherEditData = ({ publisher, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    foundedYear: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  const { mutate: createPublisher, isLoading: isCreating } = useCreatePublisher();
  const { mutate: updatePublisher, isLoading: isUpdating } = useUpdatePublisher();
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
    if (publisher) {
      setFormData({
        name: publisher.name || "",
        contactEmail: publisher.contactEmail || "",
        phone: publisher.phone || "",
        foundedYear: publisher.foundedYear || "",
        address: {
          street: publisher.address?.street || "",
          city: publisher.address?.city || "",
          state: publisher.address?.state || "",
          country: publisher.address?.country || "",
          zipCode: publisher.address?.zipCode || "",
        },
      });
    } else {
      setFormData({
        name: "",
        contactEmail: "",
        phone: "",
        foundedYear: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
      });
    }
  }, [publisher]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare submit data - remove empty address fields
    const submitData = {
      name: formData.name.trim(),
      contactEmail: formData.contactEmail.trim(),
      phone: formData.phone.trim(),
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
    };

    // Only add address if at least one field has value
    const hasAddressData = Object.values(formData.address).some(value => value && value.trim());
    if (hasAddressData) {
      submitData.address = {};
      Object.keys(formData.address).forEach(key => {
        if (formData.address[key] && formData.address[key].trim()) {
          submitData.address[key] = formData.address[key].trim();
        }
      });
    }

    console.log("Submitting publisher data:", submitData);

    if (publisher?._id) {
      updatePublisher(
        { id: publisher._id, data: submitData },
        {
          onSuccess: () => {
            showNotification("Publisher updated successfully", "success");
            onSave?.();
            onCancel();
          },
          onError: (error) => {
            console.error("Update error:", error);
            showNotification(error.response?.message || "Failed to update publisher", "error");
          },
        }
      );
    } else {
      createPublisher(submitData, {
        onSuccess: () => {
          showNotification("Publisher created successfully", "success");
          onSave?.();
          onCancel();
        },
        onError: (error) => {
          console.error("Create error:", error);
          showNotification(error.response?.message || "Failed to create publisher", "error");
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
        <h2 className="text-lg font-semibold mb-4">{publisher ? "Edit Publisher" : "Add New Publisher"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Publisher Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Enter publisher name"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                placeholder="contact@publisher.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => handleChange("foundedYear", e.target.value)}
                placeholder="e.g., 1990"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-3 text-gray-700">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleChange("address.street", e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleChange("address.city", e.target.value)}
                  placeholder="City"
                />
              </div>

              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleChange("address.state", e.target.value)}
                  placeholder="State or Province"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => handleChange("address.country", e.target.value)}
                  placeholder="Country"
                />
              </div>

              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleChange("address.zipCode", e.target.value)}
                  placeholder="Postal code"
                />
              </div>
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
              {isLoading ? "Saving..." : publisher ? "Update Publisher" : "Create Publisher"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};