import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();


console.log("CONNECTION_STRING:", process.env.CONNECTION_STRING);

const connectDb = asyncHandler(async () => {
    if (!process.env.CONNECTION_STRING) {
        throw new Error(" CONNECTION_STRING is undefined. Check your .env file.");
    }

    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Database connected: ", connect.connection.host);
});

export default connectDb;
