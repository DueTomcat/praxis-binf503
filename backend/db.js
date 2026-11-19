const mongoose = require('mongoose');

function connectDB(uri) {
  return mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}

module.exports = connectDB;
