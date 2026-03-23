const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/user');
const { User } = require('../../models/user');
const { generateToken } = require('../../utils/commonFunction');

// Mock dependencies
jest.mock('../../models/user');
jest.mock('../../utils/commonFunction');
jest.mock('../../middlewares/authUser', () => ({
  verifyToken: (req, res, next) => {
    req.user = { _id: '507f1f77bcf86cd799439011' };
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      
      User.findOne.mockResolvedValue(mockUser);
      const bcrypt = require('bcrypt');
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      generateToken.mockResolvedValue('mock-token');

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      // Fix: Access message through data property
      expect(response.body).toHaveProperty('data.message', 'Login Successfully');
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('access_token', 'mock-token');
    });
  });

  describe('POST /api/users/signup', () => {
    it('should create new user', async () => {
      User.findOne.mockResolvedValue(null);
      const bcrypt = require('bcrypt');
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed');
      User.create.mockResolvedValue({ _id: 'newId', email: 'new@example.com' });
      generateToken.mockResolvedValue('token');

      const response = await request(app)
        .post('/api/users/signup')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'new@example.com',
          password: 'password123',
          userType: 'regular'
        });

      expect(response.status).toBe(202);
      // Fix: Access message through data property
      expect(response.body).toHaveProperty('data.message', 'Account Created Successfully');
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('access_token', 'token');
    });
  });
});