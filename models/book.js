const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  ISBN: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  publicationDate: {
    type: Date
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  pages: {
    type: Number,
    min: 1
  },
  description: {
    type: String,
    maxlength: 2000
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;