import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_URI_TEST 
      : process.env.MONGODB_URI;

    const conn = await mongoose.connect(mongoURI, {
      // These options are now default in Mongoose 6+, but included for clarity
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);
    
    // Log database name for debugging
    console.log(` Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;