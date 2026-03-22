const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  foundedYear: {
    type: Number
  },
}, {
  timestamps: true
});

const Publisher = mongoose.model('Publisher', publisherSchema);
module.exports = Publisher;