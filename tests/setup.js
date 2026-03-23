process.env.NODE_ENV = 'test';
jest.setTimeout(30000);

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mongoose = require('mongoose');
mongoose.Types.ObjectId.isValid = jest.fn().mockImplementation((id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
});
