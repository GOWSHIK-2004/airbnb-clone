import mongoose from "mongoose";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

dotenv.config(); // Ensure environment variables are loaded

const connectDb = asyncHandler(async () => {
    if (!process.env.CONNECTION_STRING) {
        throw new Error("❌ CONNECTION_STRING is not defined in .env file!");
    }

    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ Database connected: ${connect.connection.host}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Stop the app if DB connection fails
    }
});

export default connectDb;

