import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    const conState = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conState.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
};

export default connectDB;
