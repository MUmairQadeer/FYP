import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const testDatabaseConnection = async () => {
  try {
    console.log('Starting Mongoose connection test...');
    console.log('Attempting to connect with MONGODB_URI...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongoose connection test passed! Host: ${conn.connection.host}`);
    
    // Count existing users
    const count = await User.countDocuments();
    console.log(`Connection successful. Current User count: ${count}`);
    
    console.log('Cleaning up connection...');
    await mongoose.disconnect();
    console.log('Test completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Mongoose connection test FAILED!');
    console.error('Error Details:', error.message);
    process.exit(1);
  }
};

testDatabaseConnection();
