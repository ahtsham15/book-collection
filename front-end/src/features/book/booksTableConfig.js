export const BOOKS_COLUMNS = [
    {
      key: "title",
      label: "BOOK TITLE",
      width: "250px",
      filterable: true,
      filterType: "input",
      filterPlaceholder: "Search title...",
      cellClassName: "font-medium text-left",
    },
    {
      key: "ISBN",
      label: "ISBN",
      width: "150px",
      filterable: true,
      filterType: "input",
      filterPlaceholder: "Search ISBN...",
    },
    {
        key: "authorName",
        label: "AUTHOR",
        width: "180px",
        filterable: true,
        filterType: "select",
        filterOptions: [],
        filterPlaceholder: "All Authors",
        render: (value) => value || "N/A",
      },
      {
        key: "publisherName",
        label: "PUBLISHER",
        width: "160px",
        filterable: true,
        filterType: "input",
        filterPlaceholder: "Filter publisher...",
        render: (value) => value || "N/A",
      },
    {
      key: "language",
      label: "LANGUAGE",
      width: "100px",
      filterable: true,
      filterType: "select",
      filterOptions: ["English", "Spanish", "French", "German", "Japanese", "Chinese", "Hindi", "Arabic"],
    },
    {
      key: "publicationDate",
      label: "PUB. DATE",
      width: "110px",
      type: "date",
      filterable: true,
      filterType: "input",
      filterPlaceholder: "YYYY-MM-DD",
    },
    {
      key: "pages",
      label: "PAGES",
      width: "80px",
      type: "number",
      filterable: true,
      filterType: "input",
      filterPlaceholder: "Min pages",
    },
    {
      key: "price",
      label: "PRICE",
      width: "90px",
      type: "currency",
      filterable: true,
      filterType: "input",
      filterPlaceholder: "Min price",
    },
    {
      key: "quantity",
      label: "QTY",
      width: "70px",
      type: "number",
      filterable: true,
      filterType: "input",
      filterPlaceholder: "Min qty",
    },
    {
      key: "averageRating",
      label: "RATING",
      width: "80px",
      type: "number",
      filterable: true,
      filterType: "select",
      filterOptions: ["1", "2", "3", "4", "5"],
    },
    {
      key: "totalReviews",
      label: "REVIEWS",
      width: "80px",
      type: "number",
      filterable: false,
    },
  ];
  
  export const BOOKS_FILTER_OPTIONS = {
    authors: [],
    genres: [],
    publishers: [],
  };
  
  export const getBookStatus = (quantity) => {
    if (quantity > 10) return "Available";
    if (quantity > 0) return "Low Stock";
    return "Out of Stock";
  };
  
  export const transformBookForTable = (book) => {
    return {
      ...book,
      authorName: book.author?.name || "Unknown Author",
      publisherName: book.publisher?.name || "Unknown Publisher",
      genreNames: book.genres?.map(g => g.name).join(", ") || "—",
      status: getBookStatus(book.quantity),
    };
  };