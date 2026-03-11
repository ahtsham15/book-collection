const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGOURL

const clientOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4
};

mongoose.connect(uri, clientOptions)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("Connection failed:", err.message));

module.exports = mongoose;
