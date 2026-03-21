const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
}, {
  timestamps: true
});

const Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre;