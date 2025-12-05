const mongoose = require('mongoose');


let isConnected = false;
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
  
}

module.exports = main;