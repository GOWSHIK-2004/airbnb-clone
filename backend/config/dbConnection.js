import mongoose from "mongoose";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

dotenv.config(); // Load environment variables

const connectDb = asyncHandler(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in the .env file! Ensure your local database is configured.");
  }

  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connected to Local MongoDB at: ${connect.connection.host}`);
  } catch (error) {
    console.error("❌ Local MongoDB connection failed.", error);
    process.exit(1); // Stop the app if the connection fails
  }
});

export default connectDb;

