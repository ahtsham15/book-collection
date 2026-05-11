export const PUBLISHERS_COLUMNS = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "contactEmail",
      label: "Contact Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
    },
    {
      key: "address",
      label: "Address",
      sortable: false,
      render: (publisher) => {
        if (!publisher.address) return "-";
        const addressParts = [];
        if (publisher.address.street) addressParts.push(publisher.address.street);
        if (publisher.address.city) addressParts.push(publisher.address.city);
        if (publisher.address.state) addressParts.push(publisher.address.state);
        if (publisher.address.country) addressParts.push(publisher.address.country);
        if (publisher.address.zipCode) addressParts.push(publisher.address.zipCode);
        
        return addressParts.length > 0 ? addressParts.join(", ") : "-";
      },
    },
    {
      key: "foundedYear",
      label: "Founded Year",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created Date",
      sortable: true,
      type: "date",
    },
  ];