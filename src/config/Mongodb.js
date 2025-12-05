const mongoose = require('mongoose');



async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
  
}

module.exports = main;