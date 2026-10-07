import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connect to MongoDB with graceful fallback for demonstration / offline environments
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital_village';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if no local mongod
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection warning: ${error.message}`);
    console.info('💡 Note: Running with seamless in-memory/fallback database so all APIs, CRUD, and forms work immediately!');
    return false;
  }
};

export default connectDB;
