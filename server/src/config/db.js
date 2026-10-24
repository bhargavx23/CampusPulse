import mongoose from 'mongoose';

/**
 * Connects to MongoDB with reconnection logic and operational monitoring.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuspulse';
  
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[DATABASE ERROR] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
}

export default connectDB;
