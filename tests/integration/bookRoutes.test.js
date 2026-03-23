const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('../../routes/bookRoutes');
const Book = require('../../models/book');
const Author = require('../../models/author');
const { mockBookData, mockAuthorData } = require('../mocks/mockData');

// Mock authentication middleware
jest.mock('../../middlewares/authUser', () => ({
  verifyToken: (req, res, next) => {
    req.user = { _id: new mongoose.Types.ObjectId(), userType: 'admin' };
    next();
  }
}));

// Mock models
jest.mock('../../models/book');
jest.mock('../../models/author');

const app = express();
app.use(express.json());
app.use('/api/books', bookRoutes);

describe('Book Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const mockAuthor = { ...mockAuthorData.validAuthor };
      const mockBook = { _id: new mongoose.Types.ObjectId(), ...mockBookData.validBook };
      
      Author.findById.mockResolvedValue(mockAuthor);
      Book.create.mockResolvedValue(mockBook);
      Book.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBook)
      });

      const response = await request(app)
        .post('/api/books')
        .send(mockBookData.validBook);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Book created successfully');
      expect(response.body.book).toBeDefined();
    });

    it('should return 403 for unauthorized access', async () => {
      // Override mock for this test
      jest.resetModules();
      jest.mock('../../middlewares/authUser', () => ({
        verifyToken: (req, res, next) => {
          req.user = { _id: new mongoose.Types.ObjectId(), userType: 'user' };
          next();
        }
      }));

      const response = await request(app)
        .post('/api/books')
        .send(mockBookData.validBook);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/books', () => {
    it('should retrieve all books', async () => {
      const mockBooks = [
        { _id: new mongoose.Types.ObjectId(), title: 'Book 1' },
        { _id: new mongoose.Types.ObjectId(), title: 'Book 2' }
      ];
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBooks)
      };
      
      Book.find.mockReturnValue(mockQuery);

      const response = await request(app).get('/api/books');

      expect(response.status).toBe(200);
      expect(response.body.books).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });
  });

  describe('GET /api/books/:id', () => {
    it('should retrieve a book by ID', async () => {
      const bookId = new mongoose.Types.ObjectId();
      const mockBook = {
        _id: bookId,
        title: 'Test Book',
        author: { firstName: 'Author' }
      };
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBook)
      };
      
      Book.findOne.mockReturnValue(mockQuery);
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      const response = await request(app).get(`/api/books/${bookId}`);

      expect(response.status).toBe(200);
      expect(response.body.book).toBeDefined();
      expect(response.body.book.title).toBe('Test Book');
    });

    it('should return 404 for non-existent book', async () => {
      const bookId = new mongoose.Types.ObjectId();
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null)
      };
      
      Book.findOne.mockReturnValue(mockQuery);
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      const response = await request(app).get(`/api/books/${bookId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update a book', async () => {
      const bookId = new mongoose.Types.ObjectId();
      const updateData = { title: 'Updated Title', price: 29.99 };
      
      const updatedBook = { _id: bookId, ...updateData };
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(updatedBook)
      };
      
      Book.findByIdAndUpdate.mockReturnValue(mockQuery);
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      const response = await request(app)
        .put(`/api/books/${bookId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Book updated successfully');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      const bookId = new mongoose.Types.ObjectId();
      
      Book.findByIdAndDelete.mockResolvedValue({ _id: bookId });
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      const response = await request(app).delete(`/api/books/${bookId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Book deleted successfully');
    });

    it('should return 404 for non-existent book', async () => {
      const bookId = new mongoose.Types.ObjectId();
      
      Book.findByIdAndDelete.mockResolvedValue(null);
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      const response = await request(app).delete(`/api/books/${bookId}`);

      expect(response.status).toBe(404);
    });
  });
});