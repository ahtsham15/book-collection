const mongoose = require('mongoose');
const createMockId = (id = null) => {
  return id || 'mock-id-' + Math.random().toString(36).substr(2, 9);
};

const mockUserData = {
  validUser: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    userType: "regular"
  },
  adminUser: {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "admin123",
    userType: "admin"
  },
  authorUser: {
    firstName: "Author",
    lastName: "Writer",
    email: "author@example.com",
    password: "author123",
    userType: "author"
  },
  existingUser: {
    firstName: "Jane",
    lastName: "Smith",
    email: "existing@example.com",
    password: "password123",
    userType: "regular"
  },
  resetCode: "123456"
};

const mockBookData = {
  validBook: {
    title: "The Great Gatsby",
    ISBN: "978-0-7432-7356-5",
    author: createMockId(),
    genres: [createMockId()],
    publisher: createMockId(),
    publicationDate: "2024-01-01",
    language: "English",
    pages: 180,
    description: "A classic novel about the American dream",
    price: 19.99,
    quantity: 100
  },
  updateBook: {
    title: "Updated Title",
    price: 29.99,
    quantity: 50,
    language: "Spanish"
  },
  invalidBook: {
    title: "",
    ISBN: "invalid",
    price: -10,
    pages: 0
  }
};

const mockAuthorData = {
  validAuthor: {
    _id: createMockId(),
    firstName: "F. Scott",
    lastName: "Fitzgerald",
    bio: "American novelist",
    nationality: "American"
  },
  secondAuthor: {
    _id: createMockId(),
    firstName: "Ernest",
    lastName: "Hemingway",
    bio: "American writer",
    nationality: "American"
  }
};

const mockGenreData = {
  fiction: {
    _id: createMockId(),
    name: "Fiction",
    description: "Literary works based on imagination"
  },
  classic: {
    _id: createMockId(),
    name: "Classic",
    description: "Enduring literary works"
  }
};

const mockPublisherData = {
  scribner: {
    _id: createMockId(),
    name: "Scribner",
    address: "New York, NY",
    contactEmail: "contact@scribner.com"
  }
};

const mockRequest = (userType = "admin", userId = null) => ({
  body: {},
  params: {},
  user: { _id: userId || createMockId(), userType: userType }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = {
  mockUserData,
  mockBookData,
  mockAuthorData,
  mockGenreData,
  mockPublisherData,
  mockRequest,
  mockResponse,
  createMockId
};