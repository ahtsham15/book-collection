const Book = require("../../models/book");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mockBookData, mockAuthorData, mockGenreData, mockPublisherData } = require("../mocks/mockData");

describe("Book Model Tests", () => {
  let mongod;

  beforeAll(async () => {
    // Connect to in-memory database for model testing
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await Book.deleteMany({});
  });

  describe("Book Model Validation", () => {
    it("should create a book with valid data", async () => {
      const bookData = {
        title: "Test Book",
        ISBN: "978-0-7432-7356-5",
        author: new mongoose.Types.ObjectId(),
        genres: [new mongoose.Types.ObjectId()],
        publisher: new mongoose.Types.ObjectId(),
        publicationDate: "2024-01-01",
        language: "English",
        pages: 200,
        description: "Test description",
        price: 29.99,
        quantity: 100
      };

      const book = new Book(bookData);
      const savedBook = await book.save();

      expect(savedBook._id).toBeDefined();
      expect(savedBook.title).toBe(bookData.title);
      expect(savedBook.ISBN).toBe(bookData.ISBN);
      expect(savedBook.price).toBe(bookData.price);
      expect(savedBook.quantity).toBe(bookData.quantity);
      expect(savedBook.pages).toBe(bookData.pages);
      expect(savedBook.language).toBe(bookData.language);
    });

    it("should require title field", async () => {
      const bookData = {
        ISBN: "978-0-7432-7356-5",
        author: new mongoose.Types.ObjectId()
      };

      const book = new Book(bookData);
      let error;

      try {
        await book.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.title).toBeDefined();
      expect(error.errors.title.message).toBeDefined();
    });

    it("should require author field", async () => {
      const bookData = {
        title: "Test Book",
        ISBN: "978-0-7432-7356-5"
      };

      const book = new Book(bookData);
      let error;

      try {
        await book.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.author).toBeDefined();
      expect(error.errors.author.message).toBeDefined();
    });

    it("should validate minimum price", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId(),
        price: -10
      };

      const book = new Book(bookData);
      let error;

      try {
        await book.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.price).toBeDefined();
      expect(error.errors.price.message).toContain("min");
    });

    it("should validate maximum price", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId(),
        price: 1000000 // Very high price, should be valid since no max limit
      };

      const book = new Book(bookData);
      const savedBook = await book.save();
      
      expect(savedBook.price).toBe(1000000);
    });

    it("should validate minimum pages", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId(),
        pages: 0
      };

      const book = new Book(bookData);
      let error;

      try {
        await book.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.pages).toBeDefined();
      expect(error.errors.pages.message).toContain("min");
    });

    it("should validate positive pages", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId(),
        pages: 100
      };

      const book = new Book(bookData);
      const savedBook = await book.save();
      
      expect(savedBook.pages).toBe(100);
    });

    it("should validate average rating range", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId(),
        averageRating: 5.5
      };

      const book = new Book(bookData);
      let error;

      try {
        await book.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.averageRating).toBeDefined();
    });

    it("should set default values correctly", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId()
      };

      const book = new Book(bookData);
      const savedBook = await book.save();

      expect(savedBook.language).toBe("English");
      expect(savedBook.price).toBe(0);
      expect(savedBook.quantity).toBe(0);
      expect(savedBook.averageRating).toBe(0);
      expect(savedBook.totalReviews).toBe(0);
    });

    it("should trim title automatically", async () => {
      const bookData = {
        title: "  Test Book with Spaces  ",
        author: new mongoose.Types.ObjectId()
      };

      const book = new Book(bookData);
      const savedBook = await book.save();

      expect(savedBook.title).toBe("Test Book with Spaces");
    });

    it("should trim ISBN automatically", async () => {
      const bookData = {
        title: "Test Book",
        ISBN: "  978-0-7432-7356-5  ",
        author: new mongoose.Types.ObjectId()
      };

      const book = new Book(bookData);
      const savedBook = await book.save();

      expect(savedBook.ISBN).toBe("978-0-7432-7356-5");
    });
  });

  describe("Book Model Schema Options", () => {
    it("should have timestamps", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId()
      };

      const book = new Book(bookData);
      const savedBook = await book.save();

      expect(savedBook.createdAt).toBeDefined();
      expect(savedBook.updatedAt).toBeDefined();
      expect(savedBook.createdAt instanceof Date).toBe(true);
      expect(savedBook.updatedAt instanceof Date).toBe(true);
    });

    it("should update timestamps on update", async () => {
      const bookData = {
        title: "Test Book",
        author: new mongoose.Types.ObjectId()
      };

      const book = new Book(bookData);
      const savedBook = await book.save();
      const originalUpdatedAt = savedBook.updatedAt;

      // Wait a moment to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 10));
      
      savedBook.title = "Updated Title";
      await savedBook.save();

      expect(savedBook.updatedAt).not.toEqual(originalUpdatedAt);
    });
  });

  describe("Book Model Unique Constraints", () => {
    it("should enforce unique ISBN", async () => {
      const isbn = "978-0-7432-7356-5";
      const authorId = new mongoose.Types.ObjectId();

      const book1 = new Book({
        title: "Book 1",
        ISBN: isbn,
        author: authorId
      });
      await book1.save();

      const book2 = new Book({
        title: "Book 2",
        ISBN: isbn,
        author: authorId
      });

      let error;
      try {
        await book2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error code
    });

    it("should allow null ISBN values", async () => {
      const authorId = new mongoose.Types.ObjectId();

      const book1 = new Book({
        title: "Book 1",
        author: authorId
      });
      await book1.save();

      const book2 = new Book({
        title: "Book 2",
        author: authorId
      });
      await book2.save();

      const books = await Book.find({ author: authorId });
      expect(books).toHaveLength(2);
    });
  });

  describe("Book Model Indexes", () => {
    it("should have title index for faster queries", async () => {
      const indexes = await Book.collection.getIndexes();
      const titleIndex = Object.values(indexes).find(
        index => index.key && index.key.title === 1
      );
      expect(titleIndex).toBeDefined();
    });
  });
});