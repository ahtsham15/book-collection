const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
      type: String,
      required: true,
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  birthDate: {
    type: String
  },
  nationality: {
    type: String,
    trim: true
  },
}, {
  timestamps: true
});

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;