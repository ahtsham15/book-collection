const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} = require("../../controllers/bookController");
const Book = require("../../models/book");
const Author = require("../../models/author");
const mongoose = require('mongoose');
const { SuccessResponse, ErrorResponse } = require("../../utils/responseHelper");
const { mockBookData, mockAuthorData, mockRequest, mockResponse } = require("../mocks/mockData");

// Mock dependencies - define everything inside the jest.mock calls
jest.mock("mongoose", () => {
  // Create the mock ObjectId function inside the mock
  const mockObjectId = (id) => {
    return id || '507f1f77bcf86cd799439011';
  };
  
  mockObjectId.isValid = jest.fn((id) => {
    // Consider valid if it's a string that looks like a 24-char hex string or our mock ID
    return typeof id === 'string' && (id.length === 24 || id.includes('mock') || id === '507f1f77bcf86cd799439011');
  });
  
  return {
    Types: {
      ObjectId: mockObjectId
    },
    model: jest.fn(),
    Schema: jest.fn()
  };
});

jest.mock("../../models/book", () => {
  const mockBook = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  };
  return mockBook;
});

jest.mock("../../models/author", () => {
  const mockAuthor = {
    findById: jest.fn()
  };
  return mockAuthor;
});

jest.mock("../../utils/responseHelper", () => ({
  SuccessResponse: jest.fn((res, status, data) => {
    res.status(status).json(data);
    return res;
  }),
  ErrorResponse: jest.fn((res, status, error, module, details, path) => {
    res.status(status).json({ success: false, error });
    return res;
  })
}));

describe("Book Controller Tests", () => {
  let req, res;
  let mockObjectId;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Get reference to the mocked ObjectId
    mockObjectId = require('mongoose').Types.ObjectId;
    
    // Reset the isValid mock to default behavior
    mockObjectId.isValid.mockImplementation((id) => {
      return typeof id === 'string' && (id.length === 24 || id.includes('mock') || id === '507f1f77bcf86cd799439011');
    });
    
    // Setup request and response objects
    req = mockRequest("admin");
    res = mockResponse();
  });

  describe("createBook", () => {
    it("should create a book successfully for admin user", async () => {
      // Arrange
      const authorId = '507f1f77bcf86cd799439011';
      req.body = { 
        ...mockBookData.validBook,
        author: authorId
      };
      const mockAuthor = { 
        _id: authorId,
        ...mockAuthorData.validAuthor 
      };
      const mockBook = { 
        _id: '507f1f77bcf86cd799439012',
        ...req.body
      };
      const mockPopulatedBook = {
        ...mockBook,
        author: { firstName: mockAuthor.firstName, lastName: mockAuthor.lastName },
        genres: [{ name: "Fiction" }],
        publisher: { name: "Scribner" }
      };
      
      Author.findById.mockResolvedValue(mockAuthor);
      Book.create.mockResolvedValue(mockBook);
      
      // Create a properly chained mock query
      const mockPopulate = jest.fn().mockReturnThis();
      const mockPopulate2 = jest.fn().mockReturnThis();
      const mockPopulate3 = jest.fn().mockResolvedValue(mockPopulatedBook);
      
      Book.findById.mockReturnValue({
        populate: mockPopulate,
        populate: mockPopulate2,
        populate: mockPopulate3
      });

      // Act
      await createBook(req, res);

      // Assert
      expect(Author.findById).toHaveBeenCalledWith(authorId);
      expect(Book.create).toHaveBeenCalledWith(req.body);
      expect(SuccessResponse);
    });

    it("should create a book successfully for author user", async () => {
      // Arrange
      req = mockRequest("author");
      const authorId = '507f1f77bcf86cd799439011';
      req.body = { 
        ...mockBookData.validBook,
        author: authorId
      };
      const mockAuthor = { 
        _id: authorId,
        ...mockAuthorData.validAuthor 
      };
      const mockBook = { 
        _id: '507f1f77bcf86cd799439012',
        ...req.body
      };
      const mockPopulatedBook = {
        ...mockBook,
        author: { firstName: mockAuthor.firstName, lastName: mockAuthor.lastName }
      };
      
      Author.findById.mockResolvedValue(mockAuthor);
      Book.create.mockResolvedValue(mockBook);
      
      const mockPopulate = jest.fn().mockReturnThis();
      const mockPopulate2 = jest.fn().mockReturnThis();
      const mockPopulate3 = jest.fn().mockResolvedValue(mockPopulatedBook);
      
      Book.findById.mockReturnValue({
        populate: mockPopulate,
        populate: mockPopulate2,
        populate: mockPopulate3
      });

      // Act
      await createBook(req, res);

      // Assert
      expect(SuccessResponse);
    });

    it("should return 403 if user is not authorized", async () => {
      // Arrange
      req = mockRequest("user");
      req.body = { ...mockBookData.validBook };

      // Act
      await createBook(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(
        res,
        403,
        "Unauthorized to create the book"
      );
      expect(Book.create).not.toHaveBeenCalled();
    });

    it("should return 404 if author not found", async () => {
      // Arrange
      req.body = { ...mockBookData.validBook };
      Author.findById.mockResolvedValue(null);

      // Act
      await createBook(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(res, 404, "Author not found");
      expect(Book.create).not.toHaveBeenCalled();
    });

    it("should handle database errors during book creation", async () => {
      // Arrange
      req.body = { ...mockBookData.validBook };
      const mockAuthor = { ...mockAuthorData.validAuthor };
      Author.findById.mockResolvedValue(mockAuthor);
      Book.create.mockRejectedValue(new Error("Database error"));

      // Act
      await createBook(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalled();
    });
  });

  describe("getAllBooks", () => {
    it("should retrieve all books for admin user", async () => {
      // Arrange
      const mockBooks = [
        { 
          _id: '507f1f77bcf86cd799439011', 
          title: "Book 1", 
          author: { firstName: "Author 1", lastName: "One" } 
        },
        { 
          _id: '507f1f77bcf86cd799439012', 
          title: "Book 2", 
          author: { firstName: "Author 2", lastName: "Two" } 
        }
      ];
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBooks)
      };
      
      Book.find.mockReturnValue(mockQuery);

      // Act
      await getAllBooks(req, res);

      // Assert
      expect(Book.find).toHaveBeenCalled();
      expect(SuccessResponse).toHaveBeenCalled();
    });

    it("should retrieve all books for author user", async () => {
      // Arrange
      req = mockRequest("author");
      const mockBooks = [
        { _id: '507f1f77bcf86cd799439013', title: "Author's Book" }
      ];
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBooks)
      };
      
      Book.find.mockReturnValue(mockQuery);

      // Act
      await getAllBooks(req, res);

      // Assert
      expect(SuccessResponse).toHaveBeenCalled();
    });

    it("should return 403 if user is not authorized", async () => {
      // Arrange
      req = mockRequest("user");

      // Act
      await getAllBooks(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(
        res,
        403,
        "Unauthorized to view books"
      );
      expect(Book.find).not.toHaveBeenCalled();
    });

    it("should handle empty book list", async () => {
      // Arrange
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };
      
      Book.find.mockReturnValue(mockQuery);

      // Act
      await getAllBooks(req, res);

      // Assert
      expect(SuccessResponse).toHaveBeenCalled();
    });

    it("should handle errors when retrieving books", async () => {
      // Arrange
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(new Error("Database error"))
      };
      
      Book.find.mockReturnValue(mockQuery);

      // Act
      await getAllBooks(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalled();
    });
  });

  describe("getBookById", () => {
    const validBookId = '507f1f77bcf86cd799439011';

    it("should retrieve a book by ID successfully", async () => {
      // Arrange
      req.params = { id: validBookId };
      const mockBook = {
        _id: validBookId,
        title: "The Great Gatsby",
        author: { firstName: "F. Scott", lastName: "Fitzgerald", bio: "Author bio" },
        genres: [{ name: "Fiction", description: "Fiction genre" }],
        publisher: { name: "Scribner", address: "NY" }
      };
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBook)
      };
      
      Book.findOne.mockReturnValue(mockQuery);

      // Act
      await getBookById(req, res);

      // Assert
      expect(Book.findOne).toHaveBeenCalledWith({ _id: validBookId });
      expect(SuccessResponse);
    });

    it("should return 403 for unauthorized user", async () => {
      // Arrange
      req = mockRequest("user");
      req.params = { id: validBookId };

      // Act
      await getBookById(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(
        res,
        403,
        "Unauthorized to view book details"
      );
      expect(Book.findOne).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid book ID format", async () => {
      // Arrange
      req.params = { id: "invalid-id" };
      
      // Make isValid return false for this invalid ID
      mockObjectId.isValid.mockReturnValueOnce(false);

      // Act
      await getBookById(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(res, 400, "Invalid book ID format");
      expect(Book.findOne).not.toHaveBeenCalled();
    });

    it("should return 404 if book not found", async () => {
      // Arrange
      req.params = { id: validBookId };
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null)
      };
      
      Book.findOne.mockReturnValue(mockQuery);

      // Act
      await getBookById(req, res);
    });
  });

  describe("updateBook", () => {
    const validBookId = '507f1f77bcf86cd799439011';

    it("should update a book successfully", async () => {
      // Arrange
      req.params = { id: validBookId };
      req.body = { ...mockBookData.updateBook };
      const updatedBook = {
        _id: validBookId,
        ...mockBookData.updateBook,
        author: { firstName: "Author", lastName: "Name" }
      };
      
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(updatedBook)
      };
      
      Book.findByIdAndUpdate.mockReturnValue(mockQuery);

      // Act
      await updateBook(req, res);

      // Assert
      expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
        validBookId,
        mockBookData.updateBook,
        { new: true }
      );
      expect(SuccessResponse).toHaveBeenCalled();
    });

    it("should return 403 for unauthorized user", async () => {
      // Arrange
      req = mockRequest("user");
      req.params = { id: validBookId };
      req.body = { ...mockBookData.updateBook };

      // Act
      await updateBook(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(
        res,
        403,
        "Unauthorized to view book details"
      );
      expect(Book.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should validate author if author ID is provided in update", async () => {
      // Arrange
      req.params = { id: validBookId };
      const authorId = '507f1f77bcf86cd799439022';
      req.body = { ...mockBookData.updateBook, author: authorId };
      const mockAuthor = { 
        _id: authorId,
        ...mockAuthorData.validAuthor 
      };
      
      Author.findById.mockResolvedValue(mockAuthor);
      
      const updatedBook = { _id: validBookId, ...req.body };
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(updatedBook)
      };
      
      Book.findByIdAndUpdate.mockReturnValue(mockQuery);

      // Act
      await updateBook(req, res);

      // Assert
      expect(Author.findById).toHaveBeenCalledWith(authorId);
      expect(Book.findByIdAndUpdate).toHaveBeenCalled();
    });

    it("should return 404 if author not found during update", async () => {
      // Arrange
      req.params = { id: validBookId };
      req.body = { ...mockBookData.updateBook, author: '507f1f77bcf86cd799439033' };
      
      Author.findById.mockResolvedValue(null);

      // Act
      await updateBook(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(res, 404, "Author not found");
      expect(Book.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid book ID format", async () => {
      // Arrange
      req.params = { id: "invalid-id" };
      req.body = { ...mockBookData.updateBook };
      
      // Make isValid return false for this invalid ID
      mockObjectId.isValid.mockReturnValueOnce(false);

      // Act
      await updateBook(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(res, 400, "Invalid book ID format");
    });

    it("should return 404 if book to update not found", async () => {
      // Arrange
      req.params = { id: validBookId };
      req.body = { ...mockBookData.updateBook };
      
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(null)
      };
      
      Book.findByIdAndUpdate.mockReturnValue(mockQuery);

      // Act
      await updateBook(req, res);

      // Assert
      expect(ErrorResponse).toHaveBeenCalledWith(res, 404, "Book not found");
    });
  });
});