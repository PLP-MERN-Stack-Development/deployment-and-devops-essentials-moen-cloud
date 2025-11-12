import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_URI_TEST 
      : process.env.MONGODB_URI;

    // Remove deprecated options - they're default in Mongoose 6+
    const conn = await mongoose.connect(mongoURI);

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    
    // Log database name for debugging
    console.log(`✓ Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;